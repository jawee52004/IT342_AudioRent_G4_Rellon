import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || userRole !== "PROVIDER") {
      navigate("/login");
    }
  }, [navigate, userRole]);

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
      <h2 style={{ fontSize: "32px", fontWeight: "bold" }}>PROVIDER DASHBOARD</h2>
      <p>Welcome, Provider <strong>{userName || "Valued Partner"}</strong></p>
      
      <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "20px", display: "inline-block" }}>
        <h3>Your Listings</h3>
        <p>No listings available yet.</p>
        <button style={{ padding: "10px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer" }}>
          Add Listing
        </button>
      </div>

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

export default ProviderDashboard;
