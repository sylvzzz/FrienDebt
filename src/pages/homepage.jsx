import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';

function Homepage() {
  const [userData, setUserData] = useState({ nome: '', email: '', total: 0 });
  const [dividas, setDividas] = useState([]);

  useEffect(() => {
    fetchUserData();
    loadDividas();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/userdata', { method: 'POST' });
      if (!res.ok) { window.location.href = '/login'; return; }
      const data = await res.json();
      console.log('userdata recebido:', data); // ← adiciona isto
      setUserData({
        nome:  data.nome,
        email: data.email,
        total: typeof data.total === 'number' ? data.total : 0
      });
    } catch (err) {
      console.error('Erro ao obter dados:', err);
      window.location.href = '/login';
    }
  };

  const loadDividas = async () => {
    try {
      const res  = await fetch('/balance', { method: 'POST' });
      const data = await res.json();
      setDividas(data);
    } catch (err) {
      console.error('Erro ao carregar dívidas:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white font-sans">

      <Navbar userData={userData} activePage="home" />

      <main className="bg-[#0d0d0f] max-w-4xl mx-auto px-4 py-8">
        {/* Boas-vindas */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Bem-Vindo, <span className="text-indigo-400">{userData.nome || '...'}</span>
          </h1>
        </div>
        {/* Saldo */}
        <div className="bg-[#0d0d0f] border border-gray-700 rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Saldo total</p>
            <p className={`text-3xl font-bold mt-1 ${userData.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              €{userData.total.toFixed(2)}
            </p>
          </div>
          <a
            href="/post"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            + Nova Dívida
          </a>
        </div>

        {/* Tabela de dívidas */}
        <div className="bg-[#0d0d0f] border border-gray-700 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Dívidas Pendentes</h2>
          </div>

          {dividas.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Sem dívidas pendentes 😁
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">A dever</th>
                  <th className="px-6 py-3 text-left">A pagar</th>
                  <th className="px-6 py-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {dividas.map((divida, index) => (
                  <tr key={index} className="border-t border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 text-white">{divida.nome_pagador}</td>
                    <td className="px-6 py-4 text-white">{divida.nome_cobrador}</td>
                    <td className={`px-6 py-4 text-right font-medium ${divida.email_cobrador === userData.email ? "text-emerald-400" : "text-red-400"}`}>
                      {divida.email_cobrador !== userData.email ? '-' : ''}€{divida.valor.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Homepage;