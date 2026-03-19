import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Cog } from "lucide-react"
import { useNotification } from "../components/Notification"

export function Account() {
  const [userData, setUserData] = useState({ nome: '', email: '', total: 0 });
  const [formData, setFormData] = useState({ nome: '', email: '' });
  const notify = useNotification();

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
      if (!res.ok) { window.location.href = '/login'; return; }
      const data = await res.json();
      setUserData({ nome: data.nome, email: data.email, total: typeof data.total === 'number' ? data.total : 0 });
      setFormData({ nome: data.nome, email: data.email });
    } catch (err) {
      window.location.href = '/login';
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (/\s/.test(formData.nome)) {
    notify("Erro", "O nome de utilizador não pode conter espaços.");
    return;
  }
  try {
    const res = await fetch('/updateuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: formData.nome })
      });
      if (res.ok)notify("Sucesso", "Nome atualizado com sucesso!");
      else if (res.status === 409)
        notify("Erro", "Este nome de utilizador já está em uso!");
      else 
        notify("Erro", "Erro ao guardar alterações, tente novamente!");
    } catch (err) {
      notify("Erro", "Erro ao guardar alterações, tente novamente!");
    }
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
        }
        else alert('Erro ao apagar a conta. Tente novamente mais tarde.');
      } catch (err) {
        alert('Erro ao apagar a conta. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-white">
      <Navbar userData={userData} activePage="account" />

      <main className="max-w-lg mx-auto px-4 py-10">
        <Card className="bg-[#0d0d0f] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white text-2xl flex items-center gap-2">
                <Cog />
                Minha Conta
              </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">

            {/* Saldo */}
            <Card className="bg-[#0d0d0f] border-gray-700">
              <CardContent className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">Saldo total</span>
                <span className={`text-lg font-bold ${userData.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  €{Number(userData.total).toFixed(2)}
                </span>
              </CardContent>
            </Card>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label className="text-gray-400">Nome de Utilizador</Label>
                <Input
                    type="text"
                    value={formData.nome}
                    required
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  className="bg-[#0d0d0f] text-white border-gray-700 focus:ring-indigo-500"
                  />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-gray-400">Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="bg-gray-800/40 text-gray-400 border-gray-700/50 cursor-not-allowed opacity-60"
                />
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                  Guardar Alterações
                </Button>
                <Button type="button" variant="secondary" onClick={fetchUserData} className="bg-gray-800 hover:bg-gray-700 text-gray-300">
                  Cancelar
                </Button>
                <Button type="button" variant="destructive" onClick={confirmDeleteAccount} className="mt-2">
                <Trash2 className="w-4 h-4 mr-2" />
                    Apagar Conta
                </Button>
              </div>
            </form>

          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default Account;