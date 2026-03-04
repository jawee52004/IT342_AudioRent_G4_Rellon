// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import landing from "./pages/Landing"; 

const Landing: React.FC = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h2>Welcome to AudioRent!</h2>
    <p>This is your landing page after login.</p>
  </div>
);

function App() {
  return (
    <Router>
      <div>
        <h1 style={{ textAlign: "center" }}>AudioRent App</h1>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="*" element={<Login />} /> {/* default */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;