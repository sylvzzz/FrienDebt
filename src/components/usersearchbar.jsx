import { useState, useEffect } from "react";
import { Search } from "lucide-react";

export default function UserSearchBar({ onAdd, email }) {
  const [pesquisa,    setPesquisa]    = useState("");
  const [resultados,  setResultados]  = useState([]);
  const [pesquisando, setPesquisando] = useState(false);
  const [adicionados, setAdicionados] = useState({});
  useEffect(() => {
  pesquisar();
}, [pesquisa]);

const pesquisar = async () => {
  if (!pesquisa.trim()) return;
  setPesquisando(true);
  setResultados([]);
  try {
    const res = await fetch(`/utilizadores/pesquisar?nome=${encodeURIComponent(pesquisa)}&email=${encodeURIComponent(email)}`);
    const data = await res.json();
    setResultados(data);

    // inicializa adicionados com quem já é amigo
    const jaAdicionados = {};
    data.forEach(u => {
      if (u.ja_amigo) jaAdicionados[u.email] = true;
    });
    setAdicionados(jaAdicionados);

  } catch (err) {
    console.error("Erro na pesquisa:", err);
  } finally {
    setPesquisando(false);
  }
};

  const adicionar = async (email) => {
    if (onAdd) await onAdd(email);
    setAdicionados((prev) => ({ ...prev, [email]: true }));
  };

  return (
    <div className="mb-10">
      <p className="text-xs text-white/40 uppercase tracking-widest mb-3">
        Adicionar Amigo
      </p>

      <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">
        <Search size={15} />
      </span>
      <input
        type="text"
        value={pesquisa}
        onChange={(e) => setPesquisa(e.target.value)}
        placeholder="Pesquisar por nome..."
        className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 pl-9 text-sm text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 transition-colors"
      />
        {/*    Writing any letter will already search for users, dont use this at scale it will blow up a database
        <button
          onClick={pesquisar}
          disabled={pesquisando}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
        >
          {pesquisando
            ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : "Pesquisar"}
        </button>
        */}
      </div>

      {resultados.length > 0 && (
        <div className="mt-3 rounded-xl border border-white/10 overflow-hidden bg-white/[0.03]">
          {resultados.map((user, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold uppercase">
                  {user.nome?.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.nome}</p>
                  <p className="text-xs text-white/30">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => adicionar(user.email)}
                disabled={adicionados[user.email]}
                className={`text-xs px-4 py-2 rounded-lg font-medium transition-colors ${
                  adicionados[user.email]
                    ? "bg-emerald-500/20 text-emerald-400 cursor-default"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white"
                }`}
              >
                {adicionados[user.email] ? "✓ Adicionado" : "+ Adicionar"}
              </button>
            </div>
          ))}
        </div>
      )}

      {pesquisa && !pesquisando && resultados.length === 0 && (
        <p className="mt-3 text-sm text-white/30 text-center">
          Nenhum utilizador encontrado
        </p>
      )}
    </div>
  );
}