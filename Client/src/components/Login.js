// Client/src/components/Login.js
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

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
    <section>
      <main>
        <div className="section-registration">
          <div className="container grid grid-two-cols">
            <div className="registration-form">
              <h1 className="main-heading mb-3">Login form</h1>
              <br />
              <form onSubmit={loginUser}>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email"
                  />
                </div>

                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                  />
                </div>
                <br />
                <button type="submit" className="btn btn-submit">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Login;
