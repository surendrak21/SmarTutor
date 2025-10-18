// Client/src/components/ProtectedRoute.jsx
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function ProtectedRoute({ children }) {
  const { state } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // If we don't have state yet, do a quick server ping to confirm auth
    const check = async () => {
      try {
        const res = await fetch("/preregistration", {
          method: "GET",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!res.ok) navigate("/login", { replace: true });
      } catch {
        navigate("/login", { replace: true });
      }
    };

    if (state !== true) check();  // when context not set to true, verify with server
  }, [state, navigate]);

  // Render anyway; if unauth, navigate will redirect
  return children;
}
