import React, { useState, useEffect } from 'react';
import Navbar        from "../components/navbar";

function RegistarDivida() {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    total: 0
  });

  const [formData, setFormData] = useState({
    descricao: '',
    pagador: '',
    data: '',
    valor: ''
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/userdata', { method: 'POST' });
      if (!res.ok) {
        window.location.href = '/login';
        return;
      }
      const data = await res.json();
      setUserData({
        nome: data.nome,
        email: data.email,
        total: typeof data.total === 'number' ? data.total : 0
      });
    } catch (err) {
      console.error('Erro ao obter dados:', err);
      window.location.href = '/login';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { descricao, pagador, data, valor } = formData;
    const cobrador = userData.nome;

    try {
      const res = await fetch('/marcar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descricao, pagador, cobrador, data, valor })
      });

      const msg = await res.text();
      alert(msg);

      if (res.ok) {
        setFormData({ descricao: '', pagador: '', data: '', valor: '' });
      }
    } catch (err) {
      console.error('Erro ao registar dívida:', err);
      alert('Erro ao registar dívida. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans">

      {/* Navbar */}
      <Navbar userData={userData} activePage="home" />

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 py-10 bg-[#0d0d0f] text-white font-sans">
        <div className="bg-[#0d0d0f] rounded-2xl p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">Registar Dívida 💳</h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="descricao" className="text-sm text-gray-400">Descrição da Dívida</label>
              <input
                type="text"
                id="descricao"
                name="descricao"
                placeholder="Ex: Jantar de sábado..."
                value={formData.descricao}
                onChange={handleChange}
                required
                className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="pagador" className="text-sm text-gray-400">Nome do devedor</label>
              <input
                type="text"
                id="pagador"
                name="pagador"
                placeholder="@utilizador"
                value={formData.pagador}
                onChange={handleChange}
                required
                className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="data" className="text-sm text-gray-400">Data</label>
              <input
                type="datetime-local"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="valor" className="text-sm text-gray-400">Valor (€)</label>
              <input
                type="number"
                id="valor"
                name="valor"
                placeholder="0.00"
                step="0.01"
                value={formData.valor}
                onChange={handleChange}
                required
                className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Criar Dívida
              </button>
              <a
                href="/"
                className="text-center bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 rounded-lg transition-colors"
              >
                Página Inicial
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default RegistarDivida;