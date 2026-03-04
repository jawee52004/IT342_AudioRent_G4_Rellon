// src/pages/Landing.tsx
import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to AudioRent!</h2>
      <p>This is your landing page for now.</p>
      <p>Later, this will be replaced with the package browsing page.</p>
      <Link to="/login" style={{ marginTop: "20px", display: "inline-block" }}>
        Go back to Login
      </Link>
    </div>
  );
};

export default Landing;