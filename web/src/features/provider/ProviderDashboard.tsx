import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../common/ApiService";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const pendingCount = rentals.filter(r => r.status === "PENDING").length;
  const confirmedCount = rentals.filter(r => r.status === "CONFIRMED").length;
  const activeRentals = rentals.filter(r => r.status === "PENDING" || r.status === "CONFIRMED");
  const totalEarnings = rentals
    .filter(r => r.status === "COMPLETED")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  const packageUsage = rentals.reduce((acc: Record<string, number>, rental) => {
    if (rental.status === "CONFIRMED") {
      acc[rental.packageName] = (acc[rental.packageName] || 0) + 1;
    }
    return acc;
  }, {});

  if (loading) return (
    <div style={loadingStyle}>
      <div>Loading provider dashboard...</div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <header style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Provider workspace</p>
          <h1 style={titleStyle}>Welcome back, {userName || "Partner"}</h1>
          <p style={subtitleStyle}>Review bookings, manage availability, and keep your equipment listings ready for renters.</p>
        </div>
        <div style={heroActionsStyle}>
          <button onClick={() => navigate("/my-packages")} style={primaryButtonStyle}>Manage Inventory</button>
          <button onClick={handleLogout} style={secondaryButtonStyle}>Logout</button>
        </div>
      </header>

      <section style={statsGridStyle}>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Pending Requests</span>
          <strong style={statNumberStyle}>{pendingCount}</strong>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Confirmed Rentals</span>
          <strong style={statNumberStyle}>{confirmedCount}</strong>
        </div>
        <div style={statCardStyle}>
          <span style={statLabelStyle}>Completed Earnings</span>
          <strong style={statNumberStyle}>${totalEarnings.toFixed(2)}</strong>
        </div>
      </section>

      <section style={insightGridStyle}>
        <article style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>Inventory Out</h2>
            <span style={pillStyle}>{activeRentals.length} active</span>
          </div>
          <ul style={inventoryListStyle}>
            {Object.entries(packageUsage).map(([name, count]) => (
              <li key={name} style={inventoryItemStyle}>
                <span>{name}</span>
                <strong style={warningTagStyle}>{count} out</strong>
              </li>
            ))}
            {Object.keys(packageUsage).length === 0 && (
              <li style={emptyInlineStyle}>No confirmed rentals are currently out.</li>
            )}
          </ul>
        </article>

        <article style={sectionCardStyle}>
          <div style={sectionHeaderStyle}>
            <h2 style={sectionTitleStyle}>Revenue Snapshot</h2>
            <span style={pillStyle}>PayMongo</span>
          </div>
          <p style={mutedTextStyle}>Estimated payout after the platform fee is applied.</p>
          <div style={payoutBoxStyle}>
            <span style={statLabelStyle}>Estimated Next Payout</span>
            <strong style={payoutValueStyle}>${(totalEarnings * 0.95).toFixed(2)}</strong>
            <small style={mutedSmallStyle}>5% platform fee applied</small>
          </div>
        </article>
      </section>

      <section style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Rental Requests</h2>
          <span style={pillStyle}>{rentals.length} total</span>
        </div>
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Item</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Duration</th>
                <th style={thStyle}>Earnings</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rentals.map(rental => (
                <tr key={rental.id}>
                  <td style={tdStyle}>
                    <div style={itemCellStyle}>
                      {rental.packageImageUrl ? (
                        <img src={rental.packageImageUrl} alt={rental.packageName} style={tableCellImgStyle} />
                      ) : (
                        <div style={tableCellImgPlaceholderStyle} />
                      )}
                      <strong>{rental.packageName}</strong>
                    </div>
                  </td>
                  <td style={tdStyle}>{rental.customerName}</td>
                  <td style={tdStyle}>{rental.startDate} to {rental.endDate}</td>
                  <td style={tdStyle}>${rental.totalPrice.toFixed(2)}</td>
                  <td style={tdStyle}><span style={getStatusStyle(rental.status)}>{rental.status}</span></td>
                  <td style={tdStyle}>
                    {rental.status === "PENDING" && (
                      <button onClick={() => handleStatusUpdate(rental.id, "CONFIRMED")} style={confirmButtonStyle}>Confirm</button>
                    )}
                    {rental.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleStatusUpdate(rental.id, "COMPLETED")}
                        disabled={new Date(rental.endDate) >= new Date()}
                        style={new Date(rental.endDate) >= new Date() ? disabledButtonStyle : completeButtonStyle}
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
                  <td colSpan={6} style={emptyTableStyle}>No rental requests found yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const getStatusStyle = (status: string): React.CSSProperties => {
  const base: React.CSSProperties = {
    borderRadius: "999px",
    fontSize: "0.72rem",
    fontWeight: 900,
    padding: "5px 10px",
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

const containerStyle: React.CSSProperties = {
  backgroundColor: "#f5f7fb",
  minHeight: "100vh",
  padding: "40px clamp(20px, 5vw, 72px) 64px",
  fontFamily: "Inter, Arial, sans-serif"
};

const heroStyle: React.CSSProperties = {
  alignItems: "center",
  background: "linear-gradient(135deg, #111827 0%, #1f2937 58%, #0f766e 100%)",
  borderRadius: "8px",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.16)",
  color: "#fff",
  display: "flex",
  gap: "28px",
  justifyContent: "space-between",
  marginBottom: "24px",
  padding: "38px"
};

const eyebrowStyle: React.CSSProperties = {
  color: "#99f6e4",
  fontSize: "0.78rem",
  fontWeight: 900,
  letterSpacing: "0.08em",
  margin: "0 0 10px",
  textTransform: "uppercase"
};

const titleStyle: React.CSSProperties = { fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 12px" };
const subtitleStyle: React.CSSProperties = { color: "#d1d5db", lineHeight: 1.65, margin: 0, maxWidth: "640px" };
const heroActionsStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "flex-end" };

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "none",
  borderRadius: "8px",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 900,
  padding: "13px 18px"
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  backgroundColor: "transparent",
  border: "1px solid rgba(255,255,255,0.32)",
  color: "#fff"
};

const statsGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  marginBottom: "18px"
};

const statCardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  padding: "22px"
};

const statLabelStyle: React.CSSProperties = { color: "#6b7280", display: "block", fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase" };
const statNumberStyle: React.CSSProperties = { color: "#111827", display: "block", fontSize: "2rem", marginTop: "8px" };

const insightGridStyle: React.CSSProperties = {
  display: "grid",
  gap: "18px",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  marginBottom: "18px"
};

const sectionCardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  padding: "24px"
};

const sectionHeaderStyle: React.CSSProperties = { alignItems: "center", display: "flex", gap: "14px", justifyContent: "space-between", marginBottom: "18px" };
const sectionTitleStyle: React.CSSProperties = { color: "#111827", fontSize: "1.1rem", fontWeight: 900, margin: 0 };
const pillStyle: React.CSSProperties = { backgroundColor: "#f3f4f6", borderRadius: "999px", color: "#4b5563", fontSize: "0.75rem", fontWeight: 900, padding: "6px 10px" };
const inventoryListStyle: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0 };
const inventoryItemStyle: React.CSSProperties = { alignItems: "center", borderBottom: "1px solid #f3f4f6", display: "flex", gap: "12px", justifyContent: "space-between", padding: "12px 0" };
const warningTagStyle: React.CSSProperties = { backgroundColor: "#fef2f2", borderRadius: "999px", color: "#991b1b", fontSize: "0.75rem", padding: "5px 10px" };
const emptyInlineStyle: React.CSSProperties = { color: "#9ca3af", padding: "16px 0" };
const mutedTextStyle: React.CSSProperties = { color: "#6b7280", lineHeight: 1.6, margin: "0 0 18px" };
const payoutBoxStyle: React.CSSProperties = { backgroundColor: "#f9fafb", border: "1px solid #eef0f3", borderRadius: "8px", padding: "18px" };
const payoutValueStyle: React.CSSProperties = { color: "#111827", display: "block", fontSize: "1.65rem", marginTop: "8px" };
const mutedSmallStyle: React.CSSProperties = { color: "#9ca3af", display: "block", marginTop: "6px" };
const tableWrapperStyle: React.CSSProperties = { overflowX: "auto" };
const tableStyle: React.CSSProperties = { borderCollapse: "collapse", textAlign: "left", width: "100%" };
const thStyle: React.CSSProperties = { borderBottom: "1px solid #e5e7eb", color: "#6b7280", fontSize: "0.74rem", fontWeight: 900, padding: "12px", textTransform: "uppercase" };
const tdStyle: React.CSSProperties = { borderBottom: "1px solid #f3f4f6", color: "#374151", padding: "14px 12px", verticalAlign: "middle" };
const itemCellStyle: React.CSSProperties = { alignItems: "center", display: "flex", gap: "12px" };
const tableCellImgStyle: React.CSSProperties = { borderRadius: "8px", height: "44px", objectFit: "cover", width: "44px" };
const tableCellImgPlaceholderStyle: React.CSSProperties = { ...tableCellImgStyle, backgroundColor: "#f3f4f6" };
const confirmButtonStyle: React.CSSProperties = { backgroundColor: "#111827", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "0.8rem", fontWeight: 900, padding: "8px 12px" };
const completeButtonStyle: React.CSSProperties = { ...confirmButtonStyle, backgroundColor: "#0f766e" };
const disabledButtonStyle: React.CSSProperties = { ...confirmButtonStyle, backgroundColor: "#e5e7eb", color: "#9ca3af", cursor: "not-allowed" };
const emptyTableStyle: React.CSSProperties = { color: "#9ca3af", padding: "42px", textAlign: "center" };
const loadingStyle: React.CSSProperties = { alignItems: "center", backgroundColor: "#f5f7fb", display: "flex", height: "100vh", justifyContent: "center" };

export default ProviderDashboard;
