import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Landing from "./pages/Landing"; 
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard"; 
import { GoogleOAuthProvider } from '@react-oauth/google';

const PackageList = React.lazy(() => import('./pages/PackageList'));
const PackageDetail = React.lazy(() => import('./pages/PackageDetail'));
const Booking = React.lazy(() => import('./pages/Booking'));
const RentalHistory = React.lazy(() => import('./pages/RentalHistory'));
const MyPackages = React.lazy(() => import('./pages/MyPackages'));
const CreatePackage = React.lazy(() => import('./pages/CreatePackage'));
const EditPackage = React.lazy(() => import('./pages/EditPackage'));

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
            {/* New Pages */}
            <Route path="/packages" element={<React.Suspense fallback={<div>Loading...</div>}><PackageList /></React.Suspense>} />
            <Route path="/packages/:id" element={<React.Suspense fallback={<div>Loading...</div>}><PackageDetail /></React.Suspense>} />
            <Route path="/packages/:id/book" element={<React.Suspense fallback={<div>Loading...</div>}><Booking /></React.Suspense>} />
            <Route path="/my-rentals" element={<React.Suspense fallback={<div>Loading...</div>}><RentalHistory /></React.Suspense>} />
            <Route path="/my-packages" element={<React.Suspense fallback={<div>Loading...</div>}><MyPackages /></React.Suspense>} />
            <Route path="/packages/create" element={<React.Suspense fallback={<div>Loading...</div>}><CreatePackage /></React.Suspense>} />
            <Route path="/packages/:id/edit" element={<React.Suspense fallback={<div>Loading...</div>}><EditPackage /></React.Suspense>} />
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;