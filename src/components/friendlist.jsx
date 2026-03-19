export default function FriendsList({ amigos = [], loading = false, onRemover }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-lg font-semibold tracking-tight">Lista de Amigos</h2>
        <div className="flex-1 h-px bg-white/10" />
        {!loading && (
          <span className="text-xs text-white/30">
            {amigos.length} amigo{amigos.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.03]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-widest">
              <th className="text-left px-6 py-4 font-medium">Utilizador</th>
              <th className="text-right px-6 py-4 font-medium">Te devem</th>
              <th className="text-right px-6 py-4 font-medium">Deves</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-16 text-white/30">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/20 border-t-indigo-400 rounded-full animate-spin" />
                    <span>Carregando...</span>
                  </div>
                </td>
              </tr>
            ) : amigos.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-16 text-white/30">
                  <p className="text-3xl mb-2">👥</p>
                  <p>Lista de amigos vazia</p>
                </td>
              </tr>
            ) : (
              amigos.map((amigo, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.04] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold uppercase">
                        {amigo.user_x?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium">{amigo.user_x}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={amigo.a_dever > 0 ? "text-emerald-400 font-semibold" : "text-white/30"}>
                      {amigo.a_dever > 0 ? `€${Number(amigo.a_dever).toFixed(2)}` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={amigo.deves > 0 ? "text-rose-400 font-semibold" : "text-white/30"}>
                      {amigo.deves > 0 ? `€${Number(amigo.deves).toFixed(2)}` : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                        onClick={() => {
                          if (window.confirm(`Tens a certeza que queres remover ${amigo.user_x}?`)) {
                            onRemover(amigo.user_x); // chama a função do pai
                          }
                        }}
                         className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-300 px-3 py-1 rounded-lg transition-colors"
                      >
                        Remover
                      </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}