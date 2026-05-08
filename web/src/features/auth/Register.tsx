import React, { useState } from "react";
import api from "../../common/api";
import { Link, useNavigate } from "react-router-dom";
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
        role
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
        const finalMessage = typeof rawData === "object" ? (rawData.message || "Error") : rawData;
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

      setSuccess("Registration successful! You can now log in.");
    } catch (err: any) {
      if (err.response) {
        const rawData = err.response.data;
        const finalMessage = typeof rawData === "object" ? (rawData.message || "Error") : rawData;
        setError(finalMessage);
      } else {
        setError("Server is offline");
      }
    }
  };

  return (
    <div style={pageStyle}>
      <main style={cardStyle}>
        <div style={cardHeaderStyle}>
          <p style={eyebrowStyle}>Create account</p>
          <h1 style={titleStyle}>Join AudioRent</h1>
          <p style={subtitleStyle}>Rent equipment for events or list your own audio gear as a provider.</p>
        </div>

        <form onSubmit={handleRegister} style={formStyle}>
          <label style={labelStyle}>Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />

          <label style={labelStyle}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />

          <label style={labelStyle}>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required style={inputStyle}>
            <option value="">Select role</option>
            <option value="CUSTOMER">Customer (Renter)</option>
            <option value="PROVIDER">Provider (Lessor)</option>
          </select>

          <label style={labelStyle}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={inputStyle} />

          <button type="submit" style={primaryButtonStyle}>Create Account</button>
        </form>

        <div style={dividerStyle}>or</div>

        <div style={googleWrapStyle}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Registration Failed")}
            theme="outline"
            shape="rectangular"
            width="360px"
          />
        </div>

        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <p style={footerTextStyle}>
          Already have an account? <Link to="/login" style={linkStyle}>Login here</Link>
        </p>
      </main>
    </div>
  );
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(135deg, #f5f7fb 0%, #eef2f7 100%)",
  padding: "32px 20px"
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
  maxWidth: "460px",
  padding: "34px",
  width: "100%"
};

const cardHeaderStyle: React.CSSProperties = { marginBottom: "26px", textAlign: "center" };
const eyebrowStyle: React.CSSProperties = { color: "#0f766e", fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", margin: "0 0 10px", textTransform: "uppercase" };
const titleStyle: React.CSSProperties = { color: "#111827", fontSize: "2rem", fontWeight: 900, margin: "0 0 8px" };
const subtitleStyle: React.CSSProperties = { color: "#6b7280", lineHeight: 1.5, margin: 0 };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column" };
const labelStyle: React.CSSProperties = { color: "#374151", fontSize: "0.78rem", fontWeight: 800, marginBottom: "8px", textTransform: "uppercase" };

const inputStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxSizing: "border-box",
  color: "#111827",
  fontSize: "1rem",
  marginBottom: "16px",
  outline: "none",
  padding: "13px 14px",
  width: "100%"
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#111827",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.98rem",
  fontWeight: 800,
  marginTop: "4px",
  padding: "14px"
};

const dividerStyle: React.CSSProperties = { color: "#9ca3af", fontSize: "0.8rem", margin: "22px 0", textAlign: "center" };
const googleWrapStyle: React.CSSProperties = { display: "flex", justifyContent: "center" };
const errorStyle: React.CSSProperties = { color: "#b91c1c", marginTop: "16px", textAlign: "center", fontWeight: 700 };
const successStyle: React.CSSProperties = { color: "#047857", marginTop: "16px", textAlign: "center", fontWeight: 700 };
const footerTextStyle: React.CSSProperties = { color: "#6b7280", marginTop: "24px", textAlign: "center", fontSize: "0.92rem" };
const linkStyle: React.CSSProperties = { color: "#0f766e", fontWeight: 800, textDecoration: "none" };

export default Register;
