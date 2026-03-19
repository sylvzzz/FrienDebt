import { useState } from "react"
import ProtectedRoute from "./components/ProtectedRoute"
import Homepage from "./pages/homepage"
import Login from "./pages/login"
import Account from "./pages/account"
import NotFound from "./components/NotFound"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        {/* <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} /> */}
        {/*<Route path="/post" element={<ProtectedRoute><RegistarDivida /></ProtectedRoute>} />
        <Route path="/marcar" element={<ProtectedRoute><RegistarDivida /></ProtectedRoute>} />
        <Route path="/amigos" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
        <Route path="/configuracoes" element={<ProtectedRoute><Account /></ProtectedRoute>} />}/>*/}
      </Routes>
    </Router>
  );
}

export default App