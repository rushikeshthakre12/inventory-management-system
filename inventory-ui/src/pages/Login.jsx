import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser, FiBox } from "react-icons/fi";
import api from "../services/api";
import "../styles/login.css";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        await api.post("/auth/register", { name, email, password });
        setIsRegister(false);
        setError("");
        alert("Registration successful! Please login.");
      } else {
        const response = await api.post("/auth/login", { email, password });
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error:", err.response);
      const msg = err.response?.data?.message || err.response?.data;
      if (typeof msg === "string") {
        setError(msg);
      } else if (isRegister) {
        setError("Registration failed. Try a different email.");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb"></div>
        <div className="login-bg-orb"></div>
        <div className="login-bg-orb"></div>
        <div className="login-bg-grid"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">
              <FiBox />
            </div>
            <h1>BeRAM Drones</h1>
            <p>Inventory Management System</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}

            {isRegister && (
              <div className="form-group-login">
                <label>Name</label>
                <div className="input-wrapper">
                  <FiUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                  />
                </div>
              </div>
            )}

            <div className="form-group-login">
              <label>Email</label>
              <div className="input-wrapper">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="admin@beram.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-login">
              <label>Password</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Please wait..." : isRegister ? "Register" : "Sign In"}
            </button>
          </form>

          <p className="login-footer" style={{ cursor: "pointer", marginTop: "20px" }}>
            <span onClick={() => { setIsRegister(!isRegister); setError(""); }}>
              {isRegister
                ? "Already have an account? Sign In"
                : "Don't have an account? Register"}
            </span>
          </p>

          <p className="login-footer">
            Secure access to inventory dashboard
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;