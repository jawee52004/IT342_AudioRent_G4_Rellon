import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={containerStyle}>
      <div style={contentCard}>
        <h2 style={brandStyle}>AUDIORENT</h2>
        <p style={welcomeStyle}>Welcome back, <strong style={{ color: "#111827" }}>{userName || "Valued User"}</strong></p>
        
        <div style={actionGrid}>
          <button onClick={() => navigate("/packages")} style={primaryBtn}>
            Browse Equipment
          </button>

          <button onClick={() => navigate("/my-rentals")} style={secondaryBtn}>
            Rental History
          </button>
        </div>

        <button onClick={handleLogout} style={logoutButtonStyle}>
          Logout
        </button>
      </div>
    </div>
  );
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "20px",
  fontFamily: "'Outfit', sans-serif"
};

const contentCard: React.CSSProperties = {
  maxWidth: "480px",
  width: "100%",
  backgroundColor: "#fff",
  padding: "60px 40px",
  borderRadius: "32px",
  textAlign: "center",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
};

const brandStyle: React.CSSProperties = { 
  fontSize: "2.5rem", 
  fontWeight: "900", 
  letterSpacing: "4px", 
  color: "#111827",
  marginBottom: "12px"
};

const welcomeStyle: React.CSSProperties = { 
  color: "#6b7280", 
  fontSize: "1.125rem",
  marginBottom: "48px"
};

const actionGrid: React.CSSProperties = { 
  display: "flex", 
  flexDirection: "column", 
  gap: "16px",
  marginBottom: "40px"
};

const primaryBtn: React.CSSProperties = {
  padding: "18px",
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "transform 0.1s"
};

const secondaryBtn: React.CSSProperties = {
  ...primaryBtn,
  backgroundColor: "#fff",
  color: "#111827",
  border: "2px solid #f3f4f6"
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "12px 24px",
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.875rem",
  transition: "all 0.2s"
};

export default Landing;