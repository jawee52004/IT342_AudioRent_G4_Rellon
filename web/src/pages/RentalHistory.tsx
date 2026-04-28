import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";

interface Rental {
  id: string;
  packageName: string;
  packageImageUrl?: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
  notes?: string;
}

const RentalHistory: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiService = ApiService.getInstance();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await apiService.getAxiosInstance().get("/rentals");
        setRentals(response.data);
      } catch (err: any) {
        setError("Failed to load rental history.");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <button onClick={() => navigate(-1)} style={backBtnStyle}>← Back</button>
            <h1 style={titleStyle}>My Rental History</h1>
            <p style={subtitleStyle}>Track your past and upcoming audio equipment rentals.</p>
          </div>
          <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
        </div>
      </header>
      
      {loading && <div style={msgBox}>Loading your rentals...</div>}
      {error && <div style={{ ...msgBox, color: "#dc2626" }}>{error}</div>}
      
      {!loading && rentals.length === 0 && (
        <div style={emptyState}>
          <p>You haven't rented any equipment yet.</p>
          <button onClick={() => navigate("/packages")} style={browseBtn}>Browse Equipment</button>
        </div>
      )}

        <div style={gridStyle}>
          {rentals.map((rental) => (
            <div key={rental.id} style={cardStyle}>
              <div style={imageContainer}>
                {rental.packageImageUrl ? (
                   <img src={rental.packageImageUrl} alt={rental.packageName} style={cardImage} />
                ) : (
                   <div style={imagePlaceholder}>No Image</div>
                )}
              </div>
              <div style={cardContent}>
                <div style={statusRow}>
                   <span style={getStatusStyle(rental.status)}>{rental.status}</span>
                   <span style={dateText}>{rental.startDate}</span>
                </div>
                <h3 style={pkgTitle}>{rental.packageName}</h3>
                <div style={detailsGrid}>
                   <div style={detailItem}>
                      <span style={detailLabel}>Duration</span>
                      <span style={detailValue}>{rental.totalDays} Days</span>
                   </div>
                   <div style={detailItem}>
                      <span style={detailLabel}>Total Paid</span>
                      <span style={detailValue}>${rental.totalPrice.toFixed(2)}</span>
                   </div>
                </div>
                <div style={notesBox}>
                   <span style={detailLabel}>Notes</span>
                   <p style={notesText}>{rental.notes || "No special instructions provided."}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

// --- Helper Functions ---

const getStatusStyle = (status: string): React.CSSProperties => {
  const base: React.CSSProperties = {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
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
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  padding: "60px 20px",
  fontFamily: "'Outfit', sans-serif"
};

const headerStyle: React.CSSProperties = {
  maxWidth: "900px",
  margin: "0 auto 48px auto"
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#6b7280",
  fontSize: "0.875rem",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "16px"
};

const titleStyle: React.CSSProperties = { fontSize: "2.5rem", fontWeight: "800", color: "#111827", margin: "0 0 8px 0" };
const subtitleStyle: React.CSSProperties = { color: "#6b7280", fontSize: "1rem" };

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
  gap: "32px",
  maxWidth: "900px",
  margin: "0 auto"
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "24px",
  overflow: "hidden",
  border: "1px solid #f3f4f6",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
  display: "flex",
  flexDirection: "column"
};

const imageContainer: React.CSSProperties = {
  width: "100%",
  height: "180px",
  backgroundColor: "#f3f4f6",
  overflow: "hidden"
};

const cardImage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const imagePlaceholder: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#9ca3af",
  fontSize: "0.875rem"
};

const cardContent: React.CSSProperties = { padding: "24px" };

const statusRow: React.CSSProperties = { 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  marginBottom: "20px" 
};

const dateText: React.CSSProperties = { fontSize: "0.875rem", color: "#6b7280", fontWeight: "600" };

const pkgTitle: React.CSSProperties = { fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "20px" };

const detailsGrid: React.CSSProperties = { 
  display: "grid", 
  gridTemplateColumns: "1fr 1fr", 
  gap: "16px"
};

const detailItem: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "4px" };
const detailLabel: React.CSSProperties = { fontSize: "0.75rem", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase" };
const detailValue: React.CSSProperties = { fontSize: "1rem", fontWeight: "700", color: "#374151" };

const notesBox: React.CSSProperties = {
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "12px",
  marginTop: "20px"
};

const notesText: React.CSSProperties = { 
  fontSize: "0.875rem", 
  color: "#4b5563", 
  margin: "4px 0 0 0", 
  lineHeight: "1.5" 
};

const msgBox: React.CSSProperties = { textAlign: "center", padding: "60px", color: "#6b7280" };
const emptyState: React.CSSProperties = { textAlign: "center", padding: "80px", backgroundColor: "#fff", borderRadius: "24px", color: "#6b7280" };

const browseBtn: React.CSSProperties = {
  marginTop: "24px",
  padding: "12px 24px",
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontWeight: "700",
  cursor: "pointer"
};

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

export default RentalHistory;
