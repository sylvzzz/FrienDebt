import { useState } from "react";
export default function Navbar({ userData = {}, activePage = "" }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "/",        label: "Início",         key: "home"    },
    { href: "/amigos", label: "Amigos",          key: "friends" },
    { href: "/post",    label: "Publicar Dívida", key: "post"    },
    /*{ href: "/logs",    label: "Histórico",       key: "logs"    },*/
  ];

  return (
    <nav className="border-b border-white/10 bg-[#0d0d0f]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="text-xl font-bold tracking-tight">
          <span className="text-indigo-400">FrienDebt</span>
        </a>

        {/* Links + Perfil */}
        <div className="flex items-center gap-6 text-sm text-white/60">
          {links.map(({ href, label, key }) => (
            <a
              key={key}
              href={href}
              className={`transition-colors hover:text-white ${
                activePage === key ? "text-white font-medium" : ""
              }`}
            >
              {label}
            </a>
          ))}

          {/* Secção de perfil */}
          <div className="flex items-center gap-3 pl-4 ml-2 border-l border-white/10">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white leading-tight">
                {userData.nome || "—"}
              </p>
              <p className="text-xs text-white/40">{userData.email || "—"}</p>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold hover:bg-indigo-500 transition-colors"
              >
                {userData.nome ? userData.nome[0].toUpperCase() : "?"}
              </button>

              {menuOpen && (
                <>
                  {/* overlay para fechar ao clicar fora */}
                  <div
                    className="fixed inset-0 z-0"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-[#1a1a1f] border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden">
                    <a
                      href="/account"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
                    >
                      ⚙️ Definições
                    </a>
                    <a
                      href="/logout"
                      className="bg-red-800 flex items-center gap-2 px-4 py-3 text-sm text-white/70 hover:bg-red-400 transition-colors"
                    >
                      Encerrar Sessão
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}