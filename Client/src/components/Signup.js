import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css"; // make sure this import is active

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const PostData = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, cpassword } = user;

    try {
      const res = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, cpassword }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        window.alert(data.error || "Invalid Registration");
        console.log("Invalid Registration");
        return;
      }

      window.alert("Registration Successful");
      console.log("Registration Successful");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Signup error:", err);
      window.alert("Network error");
    }
  };

  return (
    <section className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Join SmartTutor and start planning your semester smarter.
          </p>
        </div>

        <form className="auth-form" onSubmit={PostData}>
          <div className="form-group">
            <label htmlFor="name">Full name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={user.name}
              onChange={handleInput}
              placeholder="Your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Institute email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleInput}
              placeholder="you@iitk.ac.in"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone (optional)</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={user.phone}
              onChange={handleInput}
              placeholder="10-digit mobile"
            />
          </div>

          <div className="two-col">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={user.password}
                onChange={handleInput}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpassword">Confirm password</label>
              <input
                type="password"
                name="cpassword"
                id="cpassword"
                value={user.cpassword}
                onChange={handleInput}
                placeholder="Repeat password"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-btn">
            Create account
          </button>

          <p className="auth-hint">
            Already registered?{" "}
            <a href="/login" className="auth-link">
              Log in
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;
