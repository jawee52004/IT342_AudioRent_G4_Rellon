// src/pages/.tsx
import React, { useState } from "react";
import api from "../../common/api";
import { Link, useNavigate } from "react-router-dom"; // <-- for navigation
import { GoogleLogin } from "@react-oauth/google";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!role) {
      setError("Please select a role before registering with Google.");
      return;
    }
    setError(null);
    try {
      const response = await api.post("/auth/google", {
        token: credentialResponse.credential,
        role: role
      });

      const { token, fullName, role: r } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userRole", r);

      setSuccess("Registered with Google!");

      if (r === "PROVIDER") {
        navigate("/provider");
      } else if (r === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/landing");
      }
    } catch (err: any) {
      if (err.response) {
        const rawData = err.response.data;
        const finalMessage = typeof rawData === 'object' ? (rawData.message || "Error") : rawData;
        setError(finalMessage);
      } else {
        setError("Server failed to verify Google account.");
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await api.post("/auth/register", {
        fullName,
        email,
        password,
        role
      });

      setSuccess("Registration successful!");
    } catch (err: any) {
  if (err.response) {
    // If it's an object, grab just the message string. 
    // If it's already a string, use it.
    const rawData = err.response.data;
    const finalMessage = typeof rawData === 'object' ? (rawData.message || "Error") : rawData;
    
    setError(finalMessage); 
  } else {
    setError("Server is offline");
  }
}
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div style={{ marginBottom: "10px" }}>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{ width: "100%" }}
          >
            <option value="">Select role</option>
            <option value="CUSTOMER">Customer (Renter)</option>
            <option value="PROVIDER">Provider (Lessor)</option>
          </select>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <div style={{ textAlign: "center", margin: "15px 0", fontSize: "12px" }}>OR</div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google Registration Failed")}
          theme="outline"
          shape="square"
          width="400px"
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;