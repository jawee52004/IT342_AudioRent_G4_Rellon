import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";

// Feature: Auth
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Landing from "./features/auth/Landing";

// Feature: Provider
import ProviderDashboard from "./features/provider/ProviderDashboard";

// Feature: Admin
import AdminDashboard from "./features/admin/AdminDashboard";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Feature: Packages (lazy-loaded)
const PackageList = React.lazy(() => import("./features/packages/PackageList"));
const PackageDetail = React.lazy(() => import("./features/packages/PackageDetail"));
const CreatePackage = React.lazy(() => import("./features/packages/CreatePackage"));
const EditPackage = React.lazy(() => import("./features/packages/EditPackage"));

// Feature: Rental (lazy-loaded)
const Booking = React.lazy(() => import("./features/rental/Booking"));
const RentalHistory = React.lazy(() => import("./features/rental/RentalHistory"));

// Feature: Provider (lazy-loaded)
const MyPackages = React.lazy(() => import("./features/provider/MyPackages"));

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  const isCustomerArea =
    role === "CUSTOMER" &&
    (location.pathname === "/landing" ||
      location.pathname === "/packages" ||
      location.pathname.startsWith("/packages/") ||
      location.pathname === "/my-rentals");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={appShellStyle}>
      {isCustomerArea && (
        <nav style={customerNavStyle}>
          <Link to="/landing" style={brandStyle}>AudioRent</Link>
          <div style={navLinksStyle}>
            <Link to="/landing" style={navLinkStyle}>Home</Link>
            <Link to="/packages" style={navLinkStyle}>Browse</Link>
            <Link to="/my-rentals" style={navLinkStyle}>Rentals</Link>
            <button onClick={handleLogout} style={logoutNavButton}>Logout</button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/landing" element={<Landing />} />

        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/my-packages" element={<React.Suspense fallback={<div style={loadingStyle}>Loading...</div>}><MyPackages /></React.Suspense>} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/packages" element={<React.Suspense fallback={<div style={loadingStyle}>Loading...</div>}><PackageList /></React.Suspense>} />
        <Route path="/packages/:id" element={<React.Suspense fallback={<div style={loadingStyle}>Loading...</div>}><PackageDetail /></React.Suspense>} />
        <Route path="/packages/create" element={<React.Suspense fallback={<div style={loadingStyle}>Loading...</div>}><CreatePackage /></React.Suspense>} />
        <Route path="/packages/:id/edit" element={<React.Suspense fallback={<div style={loadingStyle}>Loading...</div>}><EditPackage /></React.Suspense>} />

        <Route path="/packages/:id/book" element={<React.Suspense fallback={<div style={loadingStyle}>Loading...</div>}><Booking /></React.Suspense>} />
        <Route path="/my-rentals" element={<React.Suspense fallback={<div style={loadingStyle}>Loading...</div>}><RentalHistory /></React.Suspense>} />

        <Route path="*" element={<Login />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="1075750667833-kisopk6s1pl2egd1a6l7cuh28aodtfrd.apps.googleusercontent.com">
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

const appShellStyle: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fb",
  color: "#111827",
  fontFamily: "Inter, Arial, sans-serif"
};

const customerNavStyle: React.CSSProperties = {
  height: "64px",
  backgroundColor: "#fff",
  borderBottom: "1px solid #e5e7eb",
  boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 clamp(20px, 8vw, 120px)",
  position: "sticky",
  top: 0,
  zIndex: 10
};

const brandStyle: React.CSSProperties = {
  color: "#111827",
  fontSize: "1.35rem",
  fontWeight: 800,
  textDecoration: "none"
};

const navLinksStyle: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  gap: "22px"
};

const navLinkStyle: React.CSSProperties = {
  color: "#4b5563",
  fontSize: "0.9rem",
  fontWeight: 700,
  textDecoration: "none"
};

const logoutNavButton: React.CSSProperties = {
  backgroundColor: "#111827",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: 800,
  padding: "9px 14px"
};

const loadingStyle: React.CSSProperties = {
  minHeight: "60vh",
  display: "grid",
  placeItems: "center",
  color: "#6b7280"
};

export default App;
