import { useState, useEffect } from "react";
import Navbar        from "../components/Navbar";
import UserSearchBar from "../components/usersearchbar";
import FriendsList   from "../components/friendlist";
export default function Friends() {
  const [userData, setUserData] = useState({ nome: "", email: "", total: 0 });
  const [amigos,   setAmigos]   = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetchUserData();
    loadAmigos();
  }, []);

  const fetchUserData = async () => {
    try {
      const res  = await fetch("/userdata", { method: "POST" });
      if (!res.ok) { window.location.href = "/login"; return; }
      const data = await res.json();
      setUserData({
        nome:  data.nome,
        email: data.email,
        total: typeof data.total === "number" ? data.total : 0,
      });
    } catch {
      window.location.href = "/login";
    }
  };

  const loadAmigos = async () => {
    try {
      const res  = await fetch("/friends");
      const data = await res.json();
      setAmigos(data);
    } catch (err) {
      console.error("Erro ao carregar amigos:", err);
    } finally {
      setLoading(false);
    }
  };

  const adicionarAmigo = async (email) => {
    try {
      const res = await fetch("/friends/adicionar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailAmigo: email }),
      });
      if (res.ok) loadAmigos();
    } catch (err) {
      console.error("Erro ao adicionar amigo:", err);
    }
  };

  function removerAmigo(nomeAmigo) {
  fetch('/remover-amigo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ⬅ envia cookies da sessão
    body: JSON.stringify({ nome_amigo: nomeAmigo })
  })
  .then(async (res) => {
    const text = await res.text();
    if (res.ok) {
      alert(text);
      setAmigos((prev) => prev.filter(a => a.user_x !== nomeAmigo));
    } else {
      notify("Erro", text);
    }
  })
  .catch(err => {
    console.error('Erro na remoção:', err);
    notify("Erro",'Erro de conexão ao servidor.');
  });
}

  const totalColor = userData.total >= 0 ? "text-emerald-400" : "text-rose-400";

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans">

      <Navbar userData={userData} activePage="friends" />

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {userData.nome || "Carregando..."}
            </h1>
            <p className="text-white/40 text-sm mt-1">{userData.email || "..."}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Saldo total</p>
            <p className={`text-2xl font-bold ${totalColor}`}>
              €{userData.total.toFixed(2)}
            </p>
          </div>
        </div>

        <UserSearchBar onAdd={adicionarAmigo} email={userData.email}/>

        <FriendsList amigos={amigos} loading={loading} onRemover={removerAmigo} />

      </div>
    </div>
  );
}