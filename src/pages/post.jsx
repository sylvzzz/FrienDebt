import React, { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import { CreditCard } from "lucide-react"
import { useNotification } from "../components/Notification"

function Post() {
  const notify = useNotification();

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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/userdata', { method: 'POST' });
      if (!res.ok) {
        window.location.href = '/signin';
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
      window.location.href = '/signin';
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

      if (res.ok) {
        notify('Sucesso', 'Dívida registada com sucesso.');
        setFormData({ descricao: '', pagador: '', data: '', valor: '' });
      } else {
        notify('Erro', 'Não foi possível registar a dívida. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao registar dívida:', err);
      notify('Erro', 'Erro de conexão. Tente novamente.');
    }
  };

  const inputClass = "w-full bg-[#0d0d0f] text-white placeholder-gray-600 px-4 py-2.5 text-sm focus:outline-none";
  const groupClass = "flex rounded-xl overflow-hidden border border-gray-800 focus-within:border-gray-600 transition-colors bg-[#0d0d0f]";
  const addonClass = "flex items-center px-4 bg-[#0d0d0f] border-r border-gray-800 text-gray-500 text-sm select-none whitespace-nowrap";

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans">

      <Navbar userData={userData} activePage="home" />

      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="rounded-2xl p-8 border border-gray-800">

          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
              <CreditCard size={18} />
            </div>
            <h1 className="text-lg font-semibold text-white">Registar Dívida</h1>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Devedor */}
            <div className={groupClass}>
              <span className={addonClass}>Devedor</span>
              <input
                type="text"
                name="pagador"
                placeholder="@utilizador"
                value={formData.pagador}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            {/* Data + Valor na mesma linha */}
            <div className="flex gap-3">
              <div className={`${groupClass} flex-1`}>
                <span className={addonClass}>Data</span>
                <input
                  type="datetime-local"
                  name="data"
                  value={formData.data}
                  onChange={handleChange}
                  required
                  className={`${inputClass} [color-scheme:dark]`}
                />
              </div>
              <div className={`${groupClass} w-36`}>
                <span className={addonClass}>€</span>
                <input
                  type="number"
                  name="valor"
                  placeholder="0.00"
                  step="0.01"
                  value={formData.valor}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Descrição — campo maior no fim */}
            <div className={`${groupClass} items-start`}>
              <span className={`${addonClass} pt-2.5`}>Descrição</span>
              <textarea
                name="descricao"
                placeholder="Ex: Jantar de sábado..."
                value={formData.descricao}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-[#0d0d0f] text-white placeholder-gray-600 px-4 py-2.5 text-sm focus:outline-none resize-none"
              />
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-2 mt-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
              >
                Criar Dívida
              </button>
              <a
                href="/"
                className="text-center bg-gray-900 hover:bg-gray-800 text-gray-400 font-semibold py-2.5 rounded-xl transition-colors text-sm border border-gray-800"
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

export default Post;