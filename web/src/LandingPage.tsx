// src/pages/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to AudioRent</h1>
      <p>Rent audio equipment easily!</p>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => navigate("/register")} style={{ marginRight: "10px" }}>
          Register
        </button>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
};

export default LandingPage;