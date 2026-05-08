import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../common/ApiService";

interface Package {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isActive: boolean;
  category: string;
  imageUrls: string[];
}

const MyPackages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const apiService = ApiService.getInstance();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAxiosInstance().get("/packages/my");
      setPackages(response.data);
    } catch (err: any) {
      setError("Failed to load your packages.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        await apiService.getAxiosInstance().delete(`/packages/${id}`);
        setPackages(packages.filter((pkg) => pkg.id !== id));
      } catch (err) {
        alert("Failed to delete package.");
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiService.getAxiosInstance().put(`/packages/${id}/toggle-status`);
      setPackages(packages.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
    } catch (err) {
      alert("Failed to toggle status");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerNav}>
        <button onClick={() => navigate("/provider")} style={backBtnStyle}>← Back to Dashboard</button>
      </div>
      
      <div style={headerAction}>
        <h2 style={listTitle}>My Equipment Inventory</h2>
        <Link to="/packages/create" style={createBtnStyle}>+ Add New Equipment</Link>
      </div>

      {loading && <div style={msgBox}>Loading inventory...</div>}
      {error && <div style={{ ...msgBox, color: "#dc2626" }}>{error}</div>}
      
      {!loading && packages.length === 0 && (
        <div style={emptyState}>
           <p>No equipment listed yet. Click "+ Add New Equipment" to start.</p>
        </div>
      )}

      <div style={packageGrid}>
        {packages.map((pkg) => (
          <div key={pkg.id} style={pkgCardStyle}>
            <div style={badgeRow}>
               <span style={categoryBadge}>{pkg.category || "Audio"}</span>
               <button 
                  onClick={() => handleToggleStatus(pkg.id)}
                  style={pkg.isActive ? activeBadgeBtn : inactiveBadgeBtn}
               >
                  {pkg.isActive ? "● Active" : "○ Disabled"}
               </button>
            </div>
            {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
              <img src={pkg.imageUrls[0]} alt={pkg.name} style={thumbnailStyle} />
            ) : (
              <div style={thumbnailPlaceholder}>No Image</div>
            )}
            <h3 style={pkgTitle}>{pkg.name}</h3>
            <div style={pkgDetails}>
               <p><strong>Rate:</strong> ${pkg.price} / day</p>
               <p><strong>Stock:</strong> {pkg.quantity} units</p>
            </div>
            <div style={actionRow}>
              <Link to={`/packages/${pkg.id}/edit`} style={editBtn}>Edit</Link>
              <button onClick={() => handleDelete(pkg.id)} style={deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
  maxWidth: "1100px",
  margin: "0 auto",
  padding: "40px 20px",
  fontFamily: "'Outfit', sans-serif"
};

const headerNav: React.CSSProperties = { marginBottom: "20px" };

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#4b5563",
  fontWeight: "600",
  fontSize: "1rem"
};

const headerAction: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px"
};

const listTitle: React.CSSProperties = { fontSize: "2rem", fontWeight: "800", color: "#111827", margin: 0 };

const createBtnStyle: React.CSSProperties = {
  backgroundColor: "#111827",
  color: "#fff",
  padding: "12px 24px",
  textDecoration: "none",
  fontWeight: "bold",
  borderRadius: "10px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
};

const packageGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "24px"
};

const pkgCardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "24px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  border: "1px solid #f3f4f6",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
};

const thumbnailStyle: React.CSSProperties = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "16px",
  marginBottom: "16px"
};

const thumbnailPlaceholder: React.CSSProperties = {
  ...thumbnailStyle,
  backgroundColor: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#9ca3af",
  fontSize: "0.875rem"
};

const badgeRow: React.CSSProperties = { display: "flex", justifyContent: "space-between", marginBottom: "16px" };

const categoryBadge: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: "bold",
  color: "#6b7280",
  backgroundColor: "#f3f4f6",
  padding: "4px 10px",
  borderRadius: "20px"
};

const activeBadgeBtn: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: "bold",
  color: "#059669",
  backgroundColor: "#ecfdf5",
  padding: "4px 10px",
  borderRadius: "20px",
  border: "1px solid #10b981",
  cursor: "pointer"
};

const inactiveBadgeBtn: React.CSSProperties = {
  ...activeBadgeBtn,
  color: "#dc2626",
  backgroundColor: "#fef2f2",
  border: "1px solid #ef4444"
};

const pkgTitle: React.CSSProperties = { fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "16px" };

const pkgDetails: React.CSSProperties = { color: "#4b5563", marginBottom: "24px" };

const actionRow: React.CSSProperties = { display: "flex", gap: "12px" };

const editBtn: React.CSSProperties = {
  flex: 1,
  textAlign: "center",
  padding: "10px",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  textDecoration: "none",
  color: "#374151",
  fontWeight: "600",
  fontSize: "0.875rem"
};

const deleteBtn: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  backgroundColor: "#fee2e2",
  border: "none",
  borderRadius: "8px",
  color: "#b91c1c",
  fontWeight: "600",
  fontSize: "0.875rem",
  cursor: "pointer"
};

const msgBox: React.CSSProperties = { textAlign: "center", padding: "40px", fontSize: "1.1rem", color: "#6b7280" };
const emptyState: React.CSSProperties = { ...msgBox, backgroundColor: "#f9fafb", borderRadius: "16px", border: "2px dashed #e5e7eb" };

export default MyPackages;
