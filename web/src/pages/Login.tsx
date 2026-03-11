import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google"; // Use the standard Google Component

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- REGULAR EMAIL/PASSWORD LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password
      });

      const { token, fullName, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", fullName);

      setSuccess("Login successful!");
      navigate("/landing");
    } catch (err: any) {
      setError(err.response?.data || "Login failed");
    }
  };

  // --- GOOGLE OAUTH SUCCESS HANDLER ---
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    try {
      // credentialResponse.credential is the JWT (ID Token) from Google
      const response = await axios.post("http://localhost:8080/auth/google", {
        token: credentialResponse.credential 
      });

      const { token, fullName, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userRole", role);

      setSuccess("Logged in with Google!");
      navigate("/landing");
    } catch (err: any) {
      console.error("Google Server Error:", err);
      setError("Server failed to verify Google account.");
    }
  };

  // --- UI STYLES (Kept from your original) ---
  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    border: "1px solid #000",
    borderRadius: "0",
    boxSizing: "border-box" as "border-box"
  };

  const blackButtonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold" as "bold",
    marginBottom: "10px"
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", letterSpacing: "2px" }}>LOGIN</h2>
      
      <form onSubmit={handleLogin}>
        <label>EMAIL</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <label>PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" style={blackButtonStyle}>LOGIN</button>
      </form>

      <div style={{ textAlign: "center", margin: "10px 0", fontSize: "12px" }}>OR</div>

      {/* Standard Google Cloud Console Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google Login Failed")}
          theme="outline"
          shape="square"
          width="400px"
        />
      </div>

      {error && <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>{error}</p>}
      {success && <p style={{ color: "green", marginTop: "15px", textAlign: "center" }}>{success}</p>}

      <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px" }}>
        Don't have an account? <Link to="/register" style={{ color: "#000" }}>Register here</Link>
      </p>
    </div>
  );
};

export default Login;