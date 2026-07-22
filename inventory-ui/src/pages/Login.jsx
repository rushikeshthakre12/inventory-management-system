import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import "../styles/login.css";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {

    try {

      const response = await api.post("/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");

    } catch (error) {

      alert("Invalid Email or Password");

    }

  };

  return (

    <div className="login-page">

      <div className="circle c1"></div>
      <div className="circle c2"></div>
      <div className="circle c3"></div>

      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >

        <h1>BeRAM Inventory</h1>

        <p>Smart Inventory Management System</p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button onClick={login}>
          Login
        </button>

      </motion.div>

    </div>

  );

}

export default Login;