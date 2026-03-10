import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
function Account() {
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    total: 0
  });

  const [formData, setFormData] = useState({
    nome: '',
    email: ''
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchUserData();

    const mensagem = sessionStorage.getItem('alert');
    if (mensagem) {
      alert(mensagem);
      sessionStorage.removeItem('alert');
    }
  }, []);

const fetchUserData = async () => {
  try {
    const res = await fetch('/userdata', { method: 'POST' });
    console.log('Status:', res.status);
    if (!res.ok) {
      window.location.href = '/login';
      return;
    }
    const data = await res.json();
    console.log('Data:', data);
    setUserData({
      nome: data.nome,
      email: data.email,
      total: typeof data.total === 'number' ? data.total : 0
    });
    setFormData({ nome: data.nome, email: data.email });
  } catch (err) {
    console.error('Erro catch:', err);
    window.location.href = '/login';
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch('/updateuser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: formData.nome })
    });
    if (res.ok) {
      alert("Nome de utilizador atualizado com sucesso!")
    } else if (res.status === 409) {
      alert('Este nome de utilizador já está em uso por outro utilizador.');
    } else {
      alert('Erro ao guardar alterações, tente novamente.');
    }
  } catch (err) {
    alert('Erro de conexão.');
  }
};

  const handleCancel = () => {
    fetchUserData();
  };

  const confirmDeleteAccount = async () => {
    if (window.confirm('Tem a certeza que deseja apagar a sua conta? Esta ação é irreversível.')) {


      try {
        const res = await fetch('/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userData.email })
        });

        if (res.ok) {
          alert('Conta apagada com sucesso.');
          window.location.href = '/iniciarsessao';
        } else {
          alert('Erro ao apagar a conta. Tente novamente mais tarde.');
        }
      } catch (err) {
        console.error('Erro ao apagar a conta:', err);
        alert('Erro ao apagar a conta. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white">

     <Navbar userData={userData} activePage="account" />

      {/* Main */}
      <main className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-[#0d0d0f] rounded-2xl p-8 border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">⚙️ Minha Conta</h1>

          {/* Saldo */}
          <div className="bg-[#0d0d0f] border border-gray-700 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-400">Saldo total</span>
            <span className={`text-lg font-bold ${userData.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              €{userData.total.toFixed(2)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Nome de Utilizador</label>
              <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={(e) => {
                              if (/\s/.test(e.target.value)) {
                                alert('O nome de utilizador não pode conter espaços.');
                              }
                              const semEspacos = e.target.value.replace(/\s/g, '');
                              setFormData(prev => ({ ...prev, nome: semEspacos }));
                  }}
                  required
                  className="bg-[#0d0d0f] text-white border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                required
                readOnly
                className="bg-gray-800/40 text-gray-400 border border-gray-700/50 rounded-lg px-4 py-2 focus:outline-none cursor-not-allowed opacity-60"
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Guardar Alterações
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors mt-2"
              >
                🗑️ Apagar Conta
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Account;