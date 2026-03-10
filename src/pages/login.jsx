import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function Login() {
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
        alert('Erro ao iniciar sessão com Google. Tente novamente.');
      }
    } catch (error) {
      alert('Erro de conexão. Tente novamente.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <main className="min-h-screen bg-gray-950 flex flex-col items-center px-4">
        <section className="w-full max-w-md flex flex-col items-center text-center pt-16 pb-10">
          <div className="w-full max-w-sm bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-800">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Frien<span className="text-green-400">Debt</span>
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
              Onde ninguém,<br />
              <span className="text-green-400">se escapa.</span>
            </h1>

            {/* Subtítulo */}
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-xs">
              Relembra os teus amigos daquilo que eles te devem.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="bg-gray-800 text-gray-300 text-xs px-4 py-1.5 rounded-full border border-gray-700">
                💸 Regista dívidas
              </span>
              <span className="bg-gray-800 text-gray-300 text-xs px-4 py-1.5 rounded-full border border-gray-700">
                👥 Entre amigos
              </span>
              <span className="bg-gray-800 text-gray-300 text-xs px-4 py-1.5 rounded-full border border-gray-700">
                ✅ Sem confusões
              </span>
            </div>

            {/* Login */}
            <p className="text-white font-bold text-center mt-8 mb-6 text-xl">Iniciar Sessão</p>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Erro ao iniciar sessão com Google.')}
                theme="outline"
                shape="pill"
                size="large"
                text="signin_with"
                locale="pt-PT"
                width="320"
              />
            </div>

          </div> {/* fecha card */}
        </section>
      </main>
    </GoogleOAuthProvider>
  );
}

export default Login;