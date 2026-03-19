import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetch("/userdata", { method: "POST" })
      .then((res) => {
        if (res.ok) setAuth(true);
        else setAuth(false);
      })
      .catch(() => setAuth(false));
  }, []);

  if (auth === null) return null; // a carregar
  if (auth === false) return <Navigate to="/login" replace />;
  return children;
}

export default ProtectedRoute;