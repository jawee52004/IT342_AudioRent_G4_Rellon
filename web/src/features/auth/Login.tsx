import React, { useState } from "react";
import api from "../../common/api";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

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
      const response = await api.post("/auth/login", { email, password });
      const { token, fullName, role, id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userId", id);

      setSuccess("Login successful!");

      if (role === "PROVIDER") {
        navigate("/provider");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/landing");
      }
    } catch (err: any) {
      const errorData = err.response?.data;
      const errorMessage = typeof errorData === "object" ? (errorData.message || "Login failed") : (errorData || "Login failed");
      setError(errorMessage);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError(null);
    try {
      const response = await api.post("/auth/google", {
        token: credentialResponse.credential
      });

      const { token, fullName, role, id } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userId", id);

      setSuccess("Logged in with Google!");

      if (role === "PROVIDER") {
        navigate("/provider");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/landing");
      }
    } catch (err: any) {
      console.error("Google Server Error:", err);
      if (err.response && err.response.data && typeof err.response.data === "string" && err.response.data.includes("Role selection is required")) {
        setError("Account not found. Please go to the Register page to create an account with Google.");
      } else {
        setError("Server failed to verify Google account.");
      }
    }
  };

  return (
    <div style={pageStyle}>
      <section style={heroPanelStyle}>
        <div>
          <p style={eyebrowStyle}>Audio equipment rentals</p>
          <h1 style={heroTitleStyle}>AudioRent</h1>
          <p style={heroCopyStyle}>Book sound systems for events, or manage your audio inventory from one focused workspace.</p>
        </div>
      </section>

      <main style={cardStyle}>
        <div style={cardHeaderStyle}>
          <h2 style={titleStyle}>Welcome back</h2>
          <p style={subtitleStyle}>Sign in to continue to your dashboard.</p>
        </div>

        <form onSubmit={handleLogin} style={formStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />

          <label style={labelStyle}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          <button type="submit" style={primaryButtonStyle}>Login</button>
        </form>

        <div style={dividerStyle}><span>or</span></div>

        <div style={googleWrapStyle}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Login Failed")}
            theme="outline"
            shape="rectangular"
            width="360px"
          />
        </div>

        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <p style={footerTextStyle}>
          Don't have an account? <Link to="/register" style={linkStyle}>Register here</Link>
        </p>
      </main>
    </div>
  );
};

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "minmax(320px, 1fr) minmax(340px, 480px)",
  backgroundColor: "#f5f7fb"
};

const heroPanelStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #111827 0%, #1f2937 58%, #0f766e 100%)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  padding: "clamp(32px, 8vw, 96px)"
};

const eyebrowStyle: React.CSSProperties = {
  color: "#99f6e4",
  fontSize: "0.82rem",
  fontWeight: 800,
  letterSpacing: "0.08em",
  margin: "0 0 16px",
  textTransform: "uppercase"
};

const heroTitleStyle: React.CSSProperties = {
  fontSize: "3.5rem",
  lineHeight: 1,
  margin: "0 0 18px",
  fontWeight: 900
};

const heroCopyStyle: React.CSSProperties = {
  color: "#d1d5db",
  fontSize: "1.05rem",
  lineHeight: 1.7,
  maxWidth: "520px",
  margin: 0
};

const cardStyle: React.CSSProperties = {
  alignSelf: "center",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
  margin: "32px",
  padding: "34px"
};

const cardHeaderStyle: React.CSSProperties = { marginBottom: "28px" };
const titleStyle: React.CSSProperties = { color: "#111827", fontSize: "2rem", fontWeight: 900, margin: "0 0 8px" };
const subtitleStyle: React.CSSProperties = { color: "#6b7280", margin: 0, lineHeight: 1.5 };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column" };
const labelStyle: React.CSSProperties = { color: "#374151", fontSize: "0.78rem", fontWeight: 800, marginBottom: "8px", textTransform: "uppercase" };

const inputStyle: React.CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  boxSizing: "border-box",
  color: "#111827",
  fontSize: "1rem",
  marginBottom: "18px",
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

const dividerStyle: React.CSSProperties = {
  alignItems: "center",
  color: "#9ca3af",
  display: "flex",
  fontSize: "0.8rem",
  justifyContent: "center",
  margin: "22px 0"
};

const googleWrapStyle: React.CSSProperties = { display: "flex", justifyContent: "center" };
const errorStyle: React.CSSProperties = { color: "#b91c1c", marginTop: "16px", textAlign: "center", fontWeight: 700 };
const successStyle: React.CSSProperties = { color: "#047857", marginTop: "16px", textAlign: "center", fontWeight: 700 };
const footerTextStyle: React.CSSProperties = { color: "#6b7280", marginTop: "24px", textAlign: "center", fontSize: "0.92rem" };
const linkStyle: React.CSSProperties = { color: "#0f766e", fontWeight: 800, textDecoration: "none" };

export default Login;
