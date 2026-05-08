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

  const activeCount = packages.filter(pkg => pkg.isActive).length;
  const totalStock = packages.reduce((sum, pkg) => sum + pkg.quantity, 0);

  return (
    <div style={containerStyle}>
      <header style={pageHeaderStyle}>
        <div>
          <button onClick={() => navigate("/provider")} style={backBtnStyle}>Back to Dashboard</button>
          <p style={eyebrowStyle}>Inventory manager</p>
          <h1 style={titleStyle}>My Equipment Inventory</h1>
          <p style={subtitleStyle}>Maintain your listings, stock counts, visibility, and rental-ready package details.</p>
        </div>
        <Link to="/packages/create" style={createBtnStyle}>Add New Equipment</Link>
      </header>

      <section style={summaryGridStyle}>
        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Total Listings</span>
          <strong style={summaryValueStyle}>{packages.length}</strong>
        </div>
        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Active Listings</span>
          <strong style={summaryValueStyle}>{activeCount}</strong>
        </div>
        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Total Stock</span>
          <strong style={summaryValueStyle}>{totalStock}</strong>
        </div>
      </section>

      {loading && <div style={msgBox}>Loading inventory...</div>}
      {error && <div style={{ ...msgBox, color: "#dc2626" }}>{error}</div>}

      {!loading && packages.length === 0 && (
        <div style={emptyState}>
          <h2 style={emptyTitleStyle}>No equipment listed yet</h2>
          <p style={emptyTextStyle}>Add your first package so customers can start booking your audio gear.</p>
          <Link to="/packages/create" style={emptyActionStyle}>Add Equipment</Link>
        </div>
      )}

      <div style={packageGridStyle}>
        {packages.map((pkg) => (
          <article key={pkg.id} style={pkgCardStyle}>
            <div style={imageWrapStyle}>
              {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
                <img src={pkg.imageUrls[0]} alt={pkg.name} style={thumbnailStyle} />
              ) : (
                <div style={thumbnailPlaceholderStyle}>No Image</div>
              )}
              <button
                onClick={() => handleToggleStatus(pkg.id)}
                style={pkg.isActive ? activeBadgeBtnStyle : inactiveBadgeBtnStyle}
              >
                {pkg.isActive ? "Active" : "Disabled"}
              </button>
            </div>

            <div style={cardBodyStyle}>
              <span style={categoryBadgeStyle}>{pkg.category || "Audio"}</span>
              <h2 style={pkgTitleStyle}>{pkg.name}</h2>
              <div style={detailsGridStyle}>
                <div>
                  <span style={detailLabelStyle}>Rate</span>
                  <strong style={detailValueStyle}>${pkg.price}/day</strong>
                </div>
                <div>
                  <span style={detailLabelStyle}>Stock</span>
                  <strong style={detailValueStyle}>{pkg.quantity} units</strong>
                </div>
              </div>
              <div style={actionRowStyle}>
                <Link to={`/packages/${pkg.id}/edit`} style={editBtnStyle}>Edit</Link>
                <button onClick={() => handleDelete(pkg.id)} style={deleteBtnStyle}>Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#f5f7fb",
  minHeight: "100vh",
  padding: "40px clamp(20px, 5vw, 72px) 64px",
  fontFamily: "Inter, Arial, sans-serif"
};

const pageHeaderStyle: React.CSSProperties = {
  alignItems: "flex-end",
  display: "flex",
  gap: "24px",
  justifyContent: "space-between",
  marginBottom: "22px"
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#4b5563",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 800,
  margin: "0 0 20px",
  padding: 0
};

const eyebrowStyle: React.CSSProperties = { color: "#0f766e", fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", margin: "0 0 10px", textTransform: "uppercase" };
const titleStyle: React.CSSProperties = { color: "#111827", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 10px" };
const subtitleStyle: React.CSSProperties = { color: "#6b7280", lineHeight: 1.6, margin: 0, maxWidth: "640px" };
const createBtnStyle: React.CSSProperties = { backgroundColor: "#111827", borderRadius: "8px", color: "#fff", fontWeight: 900, padding: "13px 18px", textDecoration: "none", whiteSpace: "nowrap" };

const summaryGridStyle: React.CSSProperties = { display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginBottom: "22px" };
const summaryCardStyle: React.CSSProperties = { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)", padding: "18px" };
const summaryLabelStyle: React.CSSProperties = { color: "#6b7280", display: "block", fontSize: "0.75rem", fontWeight: 900, textTransform: "uppercase" };
const summaryValueStyle: React.CSSProperties = { color: "#111827", display: "block", fontSize: "1.75rem", marginTop: "6px" };
const packageGridStyle: React.CSSProperties = { display: "grid", gap: "20px", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" };
const pkgCardStyle: React.CSSProperties = { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)", overflow: "hidden" };
const imageWrapStyle: React.CSSProperties = { backgroundColor: "#f3f4f6", height: "180px", position: "relative" };
const thumbnailStyle: React.CSSProperties = { display: "block", height: "100%", objectFit: "cover", width: "100%" };
const thumbnailPlaceholderStyle: React.CSSProperties = { alignItems: "center", color: "#9ca3af", display: "flex", height: "100%", justifyContent: "center" };
const activeBadgeBtnStyle: React.CSSProperties = { backgroundColor: "#ecfdf5", border: "1px solid #10b981", borderRadius: "999px", color: "#047857", cursor: "pointer", fontSize: "0.75rem", fontWeight: 900, padding: "6px 10px", position: "absolute", right: "12px", top: "12px" };
const inactiveBadgeBtnStyle: React.CSSProperties = { ...activeBadgeBtnStyle, backgroundColor: "#fef2f2", border: "1px solid #ef4444", color: "#b91c1c" };
const cardBodyStyle: React.CSSProperties = { padding: "18px" };
const categoryBadgeStyle: React.CSSProperties = { backgroundColor: "#f3f4f6", borderRadius: "999px", color: "#4b5563", display: "inline-block", fontSize: "0.72rem", fontWeight: 900, marginBottom: "12px", padding: "5px 9px" };
const pkgTitleStyle: React.CSSProperties = { color: "#111827", fontSize: "1.15rem", fontWeight: 900, lineHeight: 1.3, margin: "0 0 16px", minHeight: "3em" };
const detailsGridStyle: React.CSSProperties = { display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr", marginBottom: "18px" };
const detailLabelStyle: React.CSSProperties = { color: "#9ca3af", display: "block", fontSize: "0.72rem", fontWeight: 900, marginBottom: "4px", textTransform: "uppercase" };
const detailValueStyle: React.CSSProperties = { color: "#374151", fontSize: "0.95rem" };
const actionRowStyle: React.CSSProperties = { display: "flex", gap: "10px" };
const editBtnStyle: React.CSSProperties = { backgroundColor: "#111827", border: "1px solid #111827", borderRadius: "8px", color: "#fff", flex: 1, fontWeight: 900, padding: "10px", textAlign: "center", textDecoration: "none" };
const deleteBtnStyle: React.CSSProperties = { backgroundColor: "#fff", border: "1px solid #fecaca", borderRadius: "8px", color: "#b91c1c", cursor: "pointer", flex: 1, fontWeight: 900, padding: "10px" };
const msgBox: React.CSSProperties = { color: "#6b7280", padding: "40px", textAlign: "center" };
const emptyState: React.CSSProperties = { backgroundColor: "#fff", border: "2px dashed #d1d5db", borderRadius: "8px", color: "#6b7280", marginTop: "20px", padding: "52px", textAlign: "center" };
const emptyTitleStyle: React.CSSProperties = { color: "#111827", fontSize: "1.4rem", margin: "0 0 8px" };
const emptyTextStyle: React.CSSProperties = { margin: "0 0 22px" };
const emptyActionStyle: React.CSSProperties = { ...createBtnStyle, display: "inline-block" };

export default MyPackages;
