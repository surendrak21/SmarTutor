import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Logout = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/logout", {
          method: "POST",        // <-- IMPORTANT: POST (backend is POST)
          headers: { "Accept": "application/json" },
          credentials: "include"
        });

        // clear client state regardless
        dispatch({ type: "USER", payload: false });

        if (!res.ok) {
          console.warn("Logout failed with status", res.status);
        }
      } catch (e) {
        console.warn("Logout error", e);
      } finally {
        // force navigation after clearing cookie/state
        navigate("/login", { replace: true });
      }
    })();
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
