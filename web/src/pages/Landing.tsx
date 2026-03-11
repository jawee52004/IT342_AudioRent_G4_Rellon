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
    <div style={{ 
      textAlign: "center", 
      marginTop: "100px", 
      color: "#000",
      backgroundColor: "#fff",
      minHeight: "100vh" 
    }}>
      <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>AUDIORENT</h2>
      <p>Welcome back, <strong>{userName || "Valued User"}</strong></p>
      
      <div style={{ marginTop: "50px" }}>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            border: "2px solid #000",
            padding: "15px 40px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            textTransform: "uppercase"
          }}
        >
          Logout System
        </button>
      </div>
    </div>
  );
};

export default Landing;