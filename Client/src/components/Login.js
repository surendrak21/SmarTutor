// Client/src/components/Login.js
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import "./Login.css";


const Login = () => {
  const { dispatch } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important so cookie is set
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        window.alert(data.error || "Login failed");
        console.log("Login failed:", data);
        return;
      }

      // login success
      dispatch({ type: "USER", payload: true });
      // window.alert("Login Successful");
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      window.alert("Network error while logging in");
    }
  };

  return (
  <div className="auth-page">
    <div className="auth-shell">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        <form onSubmit={loginUser}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@iitk.ac.in"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="login-btn">
            Sign in
          </button>
        </form>

        <p className="login-hint">
          New user? <a href="/signup">Create account</a>
        </p>
      </div>
    </div>
  </div>
);

};

export default Login;
