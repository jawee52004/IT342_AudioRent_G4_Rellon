import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || userRole !== "ADMIN") {
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
      <h2 style={{ fontSize: "32px", fontWeight: "bold", color: "red" }}>ADMIN DASHBOARD</h2>
      <p>Welcome Administrator: <strong>{userName || "Admin"}</strong></p>
      
      <div style={{ marginTop: "30px", border: "1px solid #ccc", padding: "20px", display: "inline-block", textAlign: "left" }}>
        <h3 style={{ textAlign: "center" }}>System Overview</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ marginBottom: "10px" }}>Total Users: <strong>1,024</strong></li>
          <li style={{ marginBottom: "10px" }}>Pending Listings: <strong>12</strong></li>
          <li style={{ marginBottom: "10px" }}>Active Rentals: <strong>89</strong></li>
        </ul>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button style={{ padding: "10px", backgroundColor: "#000", color: "#fff", border: "none", cursor: "pointer" }}>
            View System Logs
          </button>
        </div>
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

export default AdminDashboard;
