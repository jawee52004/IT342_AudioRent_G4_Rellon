import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Landing from "./pages/Landing"; 
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard"; 
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId="1075750667833-kisopk6s1pl2egd1a6l7cuh28aodtfrd.apps.googleusercontent.com">
      <Router>
        <div style={{ fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ textAlign: "center", marginTop: "20px", letterSpacing: "2px" }}>AUDIORENT</h1>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;