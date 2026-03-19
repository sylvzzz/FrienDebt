import { useState } from "react"
import ProtectedRoute from "./components/ProtectedRoute"
import Homepage from "./pages/homepage"
import Login from "./pages/login"
import Register from "./pages/register"
import Account from "./pages/account"
import Post from "./pages/post"
import Friends from "./pages/friends"
import NotFound from "./components/NotFound"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
        <Route path="/post" element={<ProtectedRoute><Post /></ProtectedRoute>} />
        <Route path="/friendshub" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App