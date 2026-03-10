import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const credentials = async () => {
    const { nome, email, senha } = formData;

    if (!nome.trim() || !email.trim() || !senha.trim()) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const res = await fetch('/registar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha })
      });

      if (res.status === 201) {
        const yes = window.confirm('Conta criada com sucesso. Deseja iniciar sessão?');
        if (yes) {
          window.location.href = '/iniciarsessao';
        }
      }

      if (res.status === 409) {
        alert('Este E-Mail já está registado. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao registar:', error);
      alert('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Criar Conta</h1>

        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="nome" className="text-sm text-gray-400">Nome</label>
            <input
              type="text"
              id="nome"
              name="nome"
              placeholder="Nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm text-gray-400">E-Mail</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="E-Mail"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="senha" className="text-sm text-gray-400">Palavra-Passe</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Palavra-Passe"
              value={formData.senha}
              onChange={handleChange}
              required
              className="bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="button"
            onClick={credentials}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Criar Conta
          </button>

          <a
            href="/iniciarsessao"
            className="text-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Já tens conta? Iniciar Sessão
          </a>
        </form>
      </div>
    </main>
  );
}

export default Register;