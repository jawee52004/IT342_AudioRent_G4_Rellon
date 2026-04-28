import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

interface Rental {
  id: string;
  customerName: string;
  packageId?: string;
  packageName: string;
  packageImageUrl?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: string;
}

const ProviderDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const apiService = ApiService.getInstance();

  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || userRole !== "PROVIDER") {
      navigate("/login");
      return;
    }
    fetchProviderData();
  }, [navigate, userRole]);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProviderRentals();
      setRentals(response.data);
    } catch (err) {
      console.error("Failed to fetch provider rentals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (rentalId: string, status: string) => {
    try {
      await apiService.updateRentalStatus(rentalId, status);
      setRentals(rentals.map(r => r.id === rentalId ? { ...r, status } : r));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const activeRentals = rentals.filter(r => r.status === "PENDING" || r.status === "CONFIRMED");
  
  const currentlyRentedCount = activeRentals.length;

  const packageUsage = rentals.reduce((acc: any, r) => {
    if (r.status === "CONFIRMED") {
      acc[r.packageName] = (acc[r.packageName] || 0) + 1;
    }
    return acc;
  }, {});

  const totalEarnings = rentals
    .filter(r => r.status === "COMPLETED")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f8f9fa" }}>
      <div>Loading Provider Dashboard...</div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>PROVIDER DASHBOARD</h1>
          <p style={subtitleStyle}>Welcome back, {userName || "Partner"}</p>
        </div>
        <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
           <button onClick={() => navigate("/my-packages")} style={secondaryBtn}>Manage Inventory</button>
           <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
        </div>
      </header>

      <div style={statsGrid}>
        <div style={statCard}>
          <h4 style={statLabel}>Current Occupancy</h4>
          <p style={statNumber}>{activeRentals.length}</p>
        </div>
        <div style={statCard}>
          <h4 style={statLabel}>Total Earnings</h4>
          <p style={statNumber}>${totalEarnings.toFixed(2)}</p>
        </div>
        <div style={statCard}>
          <h4 style={statLabel}>Inventory Out</h4>
          <p style={statNumber}>{currentlyRentedCount} units</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        <div style={sectionCard}>
          <h3 style={sectionTitle}>Current Inventory Status</h3>
          <ul style={inventoryList}>
             {Object.entries(packageUsage).map(([name, count]: [string, any]) => (
               <li key={name} style={inventoryItem}>
                  <span>{name}</span>
                  <span style={(count as number) > 0 ? rentedTag : availableTag}>
                    {`${count} out`}
                  </span>
               </li>
             ))}
             {Object.keys(packageUsage).length === 0 && (
               <p style={{ color: "#9ca3af", textAlign: "center" }}>No inventory data.</p>
             )}
          </ul>
        </div>
        <div style={sectionCard}>
          <h3 style={sectionTitle}>Revenue Insights</h3>
          <p style={{ color: "#6b7280", fontSize: "0.95rem" }}>All payments are processed securely via PayMongo.</p>
          <div style={{ marginTop: "24px", padding: "20px", backgroundColor: "#f9fafb", borderRadius: "16px" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase" }}>Estimated Next Payout</span>
            <p style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111827", margin: "4px 0 0 0" }}>${(totalEarnings * 0.95).toFixed(2)}</p>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "4px" }}>5% platform fee applied</p>
          </div>
        </div>
      </div>

      <div style={sectionCard}>
        <h3 style={sectionTitle}>Active & Pending Rentals</h3>
        <div style={tableWrapper}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Customer</th>
                <th>Duration</th>
                <th>Earnings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map(rental => (
                <tr key={rental.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      {rental.packageImageUrl ? (
                        <img src={rental.packageImageUrl} alt={rental.packageName} style={tableCellImg} />
                      ) : (
                        <div style={tableCellImgPlaceholder} />
                      )}
                      <strong>{rental.packageName}</strong>
                    </div>
                  </td>
                  <td>{rental.customerName}</td>
                  <td>{rental.startDate} to {rental.endDate}</td>
                  <td>${rental.totalPrice.toFixed(2)}</td>
                  <td><span style={getStatusStyle(rental.status)}>{rental.status}</span></td>
                  <td>
                    {rental.status === "PENDING" && (
                      <button onClick={() => handleStatusUpdate(rental.id, "CONFIRMED")} style={actionButtonStyle}>Confirm</button>
                    )}
                    {rental.status === "CONFIRMED" && (
                      <button 
                        onClick={() => handleStatusUpdate(rental.id, "COMPLETED")} 
                        disabled={new Date(rental.endDate) >= new Date()}
                        style={new Date(rental.endDate) >= new Date() ? disabledButtonStyle : successButtonStyle}
                        title={new Date(rental.endDate) >= new Date() ? "Cannot complete until rental period ends" : "Mark as returned"}
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {rentals.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                    No rental requests found yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Helper Functions ---

const getStatusStyle = (status: string): React.CSSProperties => {
  const base: React.CSSProperties = {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase"
  };
  switch (status) {
    case "PENDING": return { ...base, backgroundColor: "#fffbeb", color: "#92400e" };
    case "CONFIRMED": return { ...base, backgroundColor: "#eff6ff", color: "#1e40af" };
    case "COMPLETED": return { ...base, backgroundColor: "#f0fdf4", color: "#166534" };
    case "CANCELLED": return { ...base, backgroundColor: "#fef2f2", color: "#991b1b" };
    default: return base;
  }
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
  padding: "40px",
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  fontFamily: "'Outfit', sans-serif"
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px"
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "900",
  margin: 0,
  background: "linear-gradient(45deg, #000, #444)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const subtitleStyle: React.CSSProperties = { color: "#6b7280", margin: "5px 0 0" };

const logoutButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.875rem",
  transition: "all 0.2s"
};

const secondaryBtn: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.875rem"
};

const secondaryButtonStyle: React.CSSProperties = {
  ...secondaryBtn,
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb"
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px",
  marginBottom: "40px"
};

const statCard: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  border: "1px solid #f3f4f6"
};

const statLabel: React.CSSProperties = { margin: 0, color: "#6b7280", fontSize: "0.875rem", fontWeight: "600" };
const statNumber: React.CSSProperties = { fontSize: "2rem", fontWeight: "800", margin: "8px 0 0", color: "#111827" };

const mainContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "20px",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
  border: "1px solid #f3f4f6",
  overflow: "hidden"
};

const tableHeader: React.CSSProperties = { padding: "24px", borderBottom: "1px solid #f3f4f6", backgroundColor: "#fff" };
const tableWrapper: React.CSSProperties = { overflowX: "auto" };
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", textAlign: "left" };

const actionButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  marginRight: "5px"
};

const successButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  backgroundColor: "#10b981"
};

const disabledButtonStyle: React.CSSProperties = {
  ...actionButtonStyle,
  backgroundColor: "#e5e7eb",
  color: "#9ca3af",
  cursor: "not-allowed"
};

const sectionCard: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#fff",
  borderRadius: "16px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  border: "1px solid #f3f4f6"
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 20px 0",
  fontSize: "1.1rem",
  fontWeight: "700",
  color: "#111827"
};

const inventoryList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0
};

const inventoryItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #f3f4f6",
  fontSize: "0.9rem",
  fontWeight: "500"
};

const rentedTag: React.CSSProperties = {
  color: "#991b1b",
  backgroundColor: "#fef2f2",
  padding: "2px 8px",
  borderRadius: "12px",
  fontSize: "0.75rem",
  fontWeight: "bold"
};

const availableTag: React.CSSProperties = {
  ...rentedTag,
  color: "#065f46",
  backgroundColor: "#ecfdf5"
};

const actionBtnStyle: React.CSSProperties = {
  padding: "12px",
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
  textAlign: "center"
};

const secondaryActionBtnStyle: React.CSSProperties = {
  ...actionBtnStyle,
  backgroundColor: "#fff",
  color: "#111827",
  border: "1px solid #e5e7eb"
};

const tableCellImg: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  objectFit: "cover"
};

const tableCellImgPlaceholder: React.CSSProperties = {
  ...tableCellImg,
  backgroundColor: "#f3f4f6"
};

export default ProviderDashboard;
