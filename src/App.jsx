import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/registar';
import Homepage from './pages/homepage';
import RegistarDivida from './pages/marcar';
import Friends from './pages/friends';
import Account from './pages/configuracoes';

function ProtectedRoute({ children }) {
  const email = document.cookie.split('; ').find(row => row.startsWith('userEmail='));
  return email ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/iniciarsessao" element={<Login />} />
        <Route path="/criarconta" element={<Register />} />
        <Route path="/registar" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/post" element={<ProtectedRoute><RegistarDivida /></ProtectedRoute>} />
        <Route path="/marcar" element={<ProtectedRoute><RegistarDivida /></ProtectedRoute>} />
        <Route path="/amigos" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;