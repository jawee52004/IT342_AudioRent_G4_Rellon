// src/pages/Login.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data);
      setSuccess("Login successful!");
      // Navigate to a dashboard or homepage after login
      navigate("/dashboard"); 
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.response) setError(err.response.data);
      else if (err.request) setError("No response from server");
      else setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <button type="submit">Login</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <p style={{ marginTop: "20px" }}>
        Don't have an account?{" "}
        <button onClick={() => navigate("/register")}>Register here</button>
      </p>
    </div>
  );
};

export default Login;