require("dotenv").config()
const express = require("express")
const mysql = require("mysql2")
const path = require("path")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const { OAuth2Client } = require("google-auth-library")
const bcrypt = require("bcrypt")
const rateLimit = require("express-rate-limit")
const app = express()
const port = process.env.PORT

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos. Tente novamente em 15 minutos." },
  validate: { trustProxy: false },
})

const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Demasiados pedidos. Tente novamente mais tarde." },
  validate: { trustProxy: false },
})

// Middleware
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set("trust proxy", true)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
)

// Conexão SQL
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

db.connect((err) => {
  if (err) {
    console.error("Erro na conexão:", err)
    return
  }
  console.log("Conectado à Base de Dados!")
})

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

app.post("/auth/google", authLimiter, async (req, res) => {
  try {
    const { token } = req.body

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const { email, name } = ticket.getPayload()

    // Procura o utilizador na base de dados
    db.query(
      "SELECT * FROM utilizadores WHERE email = ?",
      [email],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Erro na base de dados" })

        if (results.length > 0) {
          // Utilizador já existe — faz login
          req.session.user = {
            id: results[0].id,
            nome: results[0].nome,
            email: results[0].email,
          }
          res.cookie("userEmail", results[0].email, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          })
          console.log(email, "logged-in via Google")
          return res.sendStatus(200)
        } else {
          // Utilizador não existe — cria conta automaticamente
          db.query(
            "INSERT INTO utilizadores (nome, email) VALUES (?, ?)",
            [name, email],
            (err, result) => {
              if (err)
                return res
                  .status(500)
                  .json({ error: "Erro ao criar utilizador" })

              req.session.user = {
                id: result.insertId,
                nome: name,
                email,
              }

              res.cookie("userEmail", email, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
              })
              console.log(email, "registered and logged-in via Google")
              return res.sendStatus(201)
            }
          )
        }
      }
    )
  } catch (error) {
    console.error("Erro Google auth:", error)
    res.status(401).json({ error: "Token inválido" })
  }
})

app.post("/login", authLimiter, async (req, res) => {
  const { email, senha } = req.body
  const query = "SELECT * FROM utilizadores WHERE email = ?"

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error("Erro na query:", err)
      return res.sendStatus(500)
    }
    if (results.length > 0) {
      const match = await bcrypt.compare(senha, results[0].senha)
      if (!match) {
        return res.sendStatus(404)
      }
      req.session.user = {
        id: results[0].id,
        nome: results[0].nome,
        email: results[0].email,
      }
      res.cookie("userEmail", results[0].email, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      console.log(email, " logged-in, Welcome back!")
      return res.sendStatus(200)
    } else {
      return res.sendStatus(404)
    }
  })
})

app.post("/registar", authLimiter, async (req, res) => {
  const { username, email, password } = req.body
  console.log("Body recebido:", req.body)

  const verifyQuery = "SELECT * FROM utilizadores WHERE email = ? or nome = ?"
  db.query(verifyQuery, [email, username], async (err, results) => {
    if (err) {
      return res.sendStatus(500)
    }
    if (results.length > 0) return res.sendStatus(409)

    const hashedPassword = await bcrypt.hash(password, 10)
    const insertQuery =
      "INSERT INTO utilizadores (nome, email, senha) VALUES (?, ?, ?)"
    db.query(insertQuery, [username, email, hashedPassword], (err) => {
      if (err) {
        return res.sendStatus(500)
      }
      console.log(email, " created an account, Wellcome!")
      return res.sendStatus(201)
    })
  })
})

app.get("/friends", (req, res) => {
  const email = req.cookies.userEmail

  if (!email) return res.sendStatus(401)

  const query = `
SELECT
  CASE
    WHEN u1.email = ? THEN u2.nome
    ELSE u1.nome
  END AS user_x,
  CASE
    WHEN u1.email = ? THEN u2.email
    ELSE u1.email
  END AS email_x,
  (
    SELECT COALESCE(SUM(d.valor), 0)
    FROM dividas d
    WHERE d.id_cobrador = (SELECT id FROM utilizadores WHERE email = ?)
      AND d.id_pagar = CASE WHEN u1.email = ? THEN u2.id ELSE u1.id END
      AND d.paid = 0
  ) AS a_dever,
  (
    SELECT COALESCE(SUM(d.valor), 0)
    FROM dividas d
    WHERE d.id_pagar = (SELECT id FROM utilizadores WHERE email = ?)
      AND d.id_cobrador = CASE WHEN u1.email = ? THEN u2.id ELSE u1.id END
      AND d.paid = 0
  ) AS deves
FROM conns c
JOIN utilizadores u1 ON c.id_x = u1.id
JOIN utilizadores u2 ON c.id_y = u2.id
WHERE u1.email = ? OR u2.email = ?
GROUP BY u1.id, u2.id
`

  db.query(
    query,
    [email, email, email, email, email, email, email, email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Erro na query" })
      res.json(results)
    }
  )
})

app.post("/userdata", (req, res) => {
  const email = req.cookies.userEmail
  if (!email) return res.sendStatus(401)

  const query = `
  SELECT
    utilizadores.nome,
    utilizadores.email,
    SUM(
      CASE
        WHEN dividas.id_pagar = utilizadores.id THEN -dividas.valor
        WHEN dividas.id_cobrador = utilizadores.id THEN dividas.valor
        ELSE 0
      END
    ) AS saldo_total
  FROM utilizadores
  LEFT JOIN dividas
    ON (dividas.id_pagar = utilizadores.id OR dividas.id_cobrador = utilizadores.id)
    AND dividas.paid = 0
  WHERE utilizadores.email = ?
  GROUP BY utilizadores.nome, utilizadores.email
`

  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro na conexão" })
    if (results.length === 0) return res.sendStatus(401)

    res.json({
      nome: results[0].nome,
      email: results[0].email,
      total: results[0].saldo_total ?? 0,
    })
  })
})

app.post("/balance", (req, res) => {
  const email = req.cookies.userEmail

  if (!email) return res.sendStatus(401)

  const query = `
    SELECT
      dividas.id_divida AS dividas_id,
      cobrador.nome AS nome_cobrador,
      cobrador.email AS email_cobrador,
      pagador.nome AS nome_pagador,
      pagador.email AS email_pagador,
      dividas.valor
    FROM dividas
    INNER JOIN utilizadores AS cobrador ON dividas.id_cobrador = cobrador.id
    INNER JOIN utilizadores AS pagador ON dividas.id_pagar = pagador.id
    WHERE cobrador.email = ? OR pagador.email = ? and dividas.paid = 0
  `

  db.query(query, [email, email], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro na conexão" })
    return res.json(results)
  })
})

app.post("/marcar", (req, res) => {
  const { descricao, pagador, cobrador, data, valor } = req.body

  const queryPagador = "SELECT id FROM utilizadores WHERE nome = ?"
  db.query(queryPagador, [pagador], (err, rowsPagador) => {
    if (err) return res.status(500).send("Erro no servidor")
    if (rowsPagador.length === 0)
      return res.status(404).send("Pagador não encontrado")

    const idPagador = rowsPagador[0].id

    const queryCobrador = "SELECT id FROM utilizadores WHERE nome = ?"
    db.query(queryCobrador, [cobrador], (err, rowsCobrador) => {
      if (err) return res.status(500).send("Erro no servidor")
      if (rowsCobrador.length === 0)
        return res.status(404).send("Cobrador não encontrado")

      const idCobrador = rowsCobrador[0].id

      // ✅ verifica se são amigos
      const queryAmigos = `
        SELECT 1 FROM conns 
        WHERE (id_x = ? AND id_y = ?) OR (id_x = ? AND id_y = ?)
      `
      db.query(
        queryAmigos,
        [idPagador, idCobrador, idCobrador, idPagador],
        (err, rowsAmigos) => {
          if (err) return res.status(500).send("Erro no servidor")
          if (rowsAmigos.length === 0)
            return res
              .status(403)
              .send(
                "Não tens ",
                pagador,
                " adicionado/a como amigo. Só podes adicionar dívidas a utilizadores de que és amigo."
              )

          const queryInsert = `
          INSERT INTO dividas (id_pagar, id_cobrador, valor, dat, descricao, paid)
          VALUES (?, ?, ?, ?, ?, ?)
        `
          db.query(
            queryInsert,
            [idPagador, idCobrador, valor, data, descricao, 0],
            (err) => {
              if (err) return res.status(500).send("Erro no servidor")
              res.status(201).send("Dívida criada com sucesso")
              console.log(
                cobrador,
                " posted a new Debt: ",
                pagador,
                " owes ",
                valor,
                "€ for ",
                descricao
              )
            }
          )
        }
      )
    })
  })
})

app.post("/remover-amigo", (req, res) => {
  // Verifica se o utilizador está logado
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).send("Não estás logado")
  }

  const { nome_amigo } = req.body
  const idUser = req.session.user.id

  // Verifica se o nome do amigo foi enviado
  if (!nome_amigo) return res.status(400).send("Nome do amigo é obrigatório")

  // Procura o id do amigo na base de dados
  const queryAmigo = "SELECT id FROM utilizadores WHERE nome = ?"
  db.query(queryAmigo, [nome_amigo], (err, rows) => {
    if (err) {
      console.error("Erro na query de amigo:", err)
      return res.status(500).send("Erro no servidor")
    }

    if (rows.length === 0)
      return res.status(404).send("Utilizador não encontrado")

    const idAmigo = rows[0].id

    // Remove a amizade da tabela conns
    const queryRemover = `
      DELETE FROM conns 
      WHERE (id_x = ? AND id_y = ?) OR (id_x = ? AND id_y = ?)
    `
    db.query(
      queryRemover,
      [idUser, idAmigo, idAmigo, idUser],
      (err, result) => {
        if (err) {
          console.error("Erro ao remover amizade:", err)
          return res.status(500).send("Erro no servidor")
        }

        if (result.affectedRows === 0)
          return res.status(404).send("Amizade não encontrada")

        res.status(200).send(`Amizade com ${nome_amigo} removida com sucesso`)
      }
    )
  })
})
app.get("/utilizadores/pesquisar", (req, res) => {
  const { nome, email } = req.query
  const query = `
    SELECT u.nome, u.email,
      EXISTS(
        SELECT 1 FROM conns 
        WHERE (id_x = (SELECT id FROM utilizadores WHERE email = ?) AND id_y = u.id)
           OR (id_x = u.id AND id_y = (SELECT id FROM utilizadores WHERE email = ?))
      ) AS ja_amigo
    FROM utilizadores u
    WHERE u.nome LIKE ? AND u.email != ?
  `
  db.query(query, [email, email, `%${nome}%`, email], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro na pesquisa" })
    res.json(results)
  })
})

app.post("/friends/adicionar", (req, res) => {
  const emailUser = req.cookies.userEmail
  const { emailAmigo } = req.body

  const queryIds = "SELECT id FROM utilizadores WHERE email = ?"

  db.query(queryIds, [emailUser], (err, resUser) => {
    if (err || resUser.length === 0) return res.sendStatus(500)
    const idUser = resUser[0].id

    db.query(queryIds, [emailAmigo], (err, resAmigo) => {
      if (err || resAmigo.length === 0) return res.sendStatus(404)
      const idAmigo = resAmigo[0].id

      const insert = "INSERT IGNORE INTO conns (id_x, id_y) VALUES (?, ?)"
      db.query(insert, [idUser, idAmigo], (err) => {
        if (err) return res.sendStatus(500)
        res.sendStatus(200)
        console.log(emailUser, " added ", emailAmigo)
      })
    })
  })
})

app.post("/updateuser", (req, res) => {
  const email = req.cookies.userEmail
  const { nome } = req.body
  if (!email) return res.sendStatus(401)

  db.query(
    "SELECT * FROM utilizadores WHERE nome = ? AND email != ?",
    [nome, email],
    (err, results) => {
      if (err) return res.status(500).send("Erro no servidor.")
      if (results.length > 0) return res.sendStatus(409)

      db.query(
        "UPDATE utilizadores SET nome = ? WHERE email = ?",
        [nome, email],
        (err) => {
          if (err) return res.status(500).json({ error: "Erro ao atualizar" })
          res.sendStatus(200)
        }
      )
    }
  )
})

app.post("/delete", (req, res) => {
  const { email } = req.body

  const query = "SELECT * FROM utilizadores WHERE email = ?"
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).send("Erro no servidor.")
    if (results.length === 0) return res.sendStatus(401)

    const del = "DELETE FROM utilizadores WHERE email = ?"
    db.query(del, [email], (errDel) => {
      if (errDel) return res.status(500).send("Erro ao eliminar utilizador.")
      res.clearCookie("userEmail")
      res.sendStatus(200)
      console.log(email, " deleted his account")
    })
  })
})

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("userEmail")
  req.session.destroy()
  res.redirect("/signup")
})

app.use(express.static(path.join(__dirname, "public")))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(port, () => {
  console.log(`Servidor ligado na porta ${port}`)
})

process.on("SIGINT", () => {
  console.log("\nEncerrando servidor...")
  db.end()
  process.exit(0)
})
