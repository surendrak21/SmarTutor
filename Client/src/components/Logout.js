// Client/src/components/Logout.js
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Logout = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const doLogout = async () => {
      try {
        // tells server to clear cookie
        await fetch("/logout", {
          method: "POST", // backend uses POST
          headers: { Accept: "application/json" },
          credentials: "include",
        });
      } catch (err) {
        console.warn("Logout request error:", err);
      } finally {
        // clear client auth state no matter what
        dispatch({ type: "USER", payload: false });
        navigate("/login", { replace: true });
      }
    };

    doLogout();
  }, [dispatch, navigate]);

  return null;
};

export default Logout;
