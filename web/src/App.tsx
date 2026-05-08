import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Feature: Auth
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Landing from "./features/auth/Landing"; 

// Feature: Provider
import ProviderDashboard from "./features/provider/ProviderDashboard";

// Feature: Admin
import AdminDashboard from "./features/admin/AdminDashboard"; 

import { GoogleOAuthProvider } from '@react-oauth/google';

// Feature: Packages (lazy-loaded)
const PackageList = React.lazy(() => import('./features/packages/PackageList'));
const PackageDetail = React.lazy(() => import('./features/packages/PackageDetail'));
const CreatePackage = React.lazy(() => import('./features/packages/CreatePackage'));
const EditPackage = React.lazy(() => import('./features/packages/EditPackage'));

// Feature: Rental (lazy-loaded)
const Booking = React.lazy(() => import('./features/rental/Booking'));
const RentalHistory = React.lazy(() => import('./features/rental/RentalHistory'));

// Feature: Provider (lazy-loaded)
const MyPackages = React.lazy(() => import('./features/provider/MyPackages'));

function App() {
  return (
    <GoogleOAuthProvider clientId="1075750667833-kisopk6s1pl2egd1a6l7cuh28aodtfrd.apps.googleusercontent.com">
      <Router>
        <div style={{ fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ textAlign: "center", marginTop: "20px", letterSpacing: "2px" }}>AUDIORENT</h1>
          <Routes>
            {/* Auth Feature */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/landing" element={<Landing />} />

            {/* Provider Feature */}
            <Route path="/provider" element={<ProviderDashboard />} />
            <Route path="/my-packages" element={<React.Suspense fallback={<div>Loading...</div>}><MyPackages /></React.Suspense>} />

            {/* Admin Feature */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Packages Feature */}
            <Route path="/packages" element={<React.Suspense fallback={<div>Loading...</div>}><PackageList /></React.Suspense>} />
            <Route path="/packages/:id" element={<React.Suspense fallback={<div>Loading...</div>}><PackageDetail /></React.Suspense>} />
            <Route path="/packages/create" element={<React.Suspense fallback={<div>Loading...</div>}><CreatePackage /></React.Suspense>} />
            <Route path="/packages/:id/edit" element={<React.Suspense fallback={<div>Loading...</div>}><EditPackage /></React.Suspense>} />

            {/* Rental Feature */}
            <Route path="/packages/:id/book" element={<React.Suspense fallback={<div>Loading...</div>}><Booking /></React.Suspense>} />
            <Route path="/my-rentals" element={<React.Suspense fallback={<div>Loading...</div>}><RentalHistory /></React.Suspense>} />

            {/* Default */}
            <Route path="*" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;