import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank, HandCoins, Handshake, BookCheck, Eye, EyeOff } from "lucide-react";
import { useNotification } from "../components/Notification"

function Login() {
  const notify = useNotification();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSuccess = async ({ credential }) => {
    try {
      const res = await fetch('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credential })
      });
      if (res.status === 201) {
        sessionStorage.setItem('alert', 'Bem-vindo! Por favor introduz um novo username.');
        window.location.href = '/account';
      } else if (res.ok) {
        window.location.href = '/';
      } else {
        notify('Erro','Falha ao iniciar sessão com Google. Tente novamente.');
      }
    } catch (error) {
      notify('Erro','Falha na conexão. Tente novamente.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        window.location.href = '/';
      } else if (res.status === 404) {
        setError('Email ou palavra-passe incorretos.');
      } else if (res.status === 500) {
        setError('Erro interno do servidor. Tente novamente mais tarde.');
      } else {
        setError('Erro ao iniciar sessão. Tente novamente.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main className="min-h-screen bg-gray-950 flex flex-col items-center px-4">
        <section className="w-full max-w-md flex flex-col items-center text-center pt-16 pb-10">

          <Card className="w-full max-w-sm bg-gray-900 border-gray-800 shadow-xl rounded-2xl">
            <CardContent className="p-8">

              {/* Logo */}
              <div className="flex justify-center items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                  <PiggyBank />
                </div>
                <span className="text-2xl font-extrabold text-white tracking-tight">
                  Frien<span className="text-green-400">Debt</span>
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-xl font-extrabold text-white leading-tight tracking-tight">
                Relembra os teus amigos,<br />
                <span className="text-green-400">Rdaquilo que eles te devem.</span>
              </h3>

              {/* Pills */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700 px-4 py-1.5 rounded-full text-xs">
                  <HandCoins /> Regista dívidas
                </Badge>
                <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700 px-4 py-1.5 rounded-full text-xs">
                  <Handshake /> Entre amigos
                </Badge>
                <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700 px-4 py-1.5 rounded-full text-xs">
                  <BookCheck /> De forma segura e Fácil
                </Badge>
              </div>

              {/* Login */}
              <p className="text-white font-bold text-center mt-8 mb-6 text-xl">Iniciar Sessão</p>

              {/* Email & Password Form */}
              <div className="flex flex-col gap-3 mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors"
                />

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Palavra-passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 pr-11 text-sm focus:outline-none focus:border-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Esconder palavra-passe' : 'Mostrar palavra-passe'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-left px-1">{error}</p>
                )}

                <button
                  onClick={handleLogin}
                  disabled={loading || !email || !password}
                  className="w-full bg-green-500 hover:bg-green-400 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 text-sm transition-colors mt-1"
                >
                  {loading ? 'A entrar...' : 'Iniciar Sessão'}
                </button>
                <p className="text-gray-400 text-xs">
                  Ainda não tens uma conta?{' '}
                  <a href="/signup" className="text-blue-400">Criar Conta</a>
                </p>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-gray-500 text-xs">ou</span>
                <div className="flex-1 h-px bg-gray-700" />
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => notify('Erro','Falha ao iniciar sessão com Google.')}
                  theme="outline"
                  shape="pill"
                  size="large"
                  text="signin_with"
                  locale="pt-PT"
                  width="320"
                />
              </div>

            </CardContent>
          </Card>

        </section>
      </main>
    </GoogleOAuthProvider>
  );
}

export default Login;