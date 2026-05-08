import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../common/api";

interface PackageDetailType {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  providerName: string;
  category: string;
  imageUrls: string[];
}

const PackageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pkg, setPkg] = useState<PackageDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await api.get(`/packages/${id}`);
        setPkg(response.data);
      } catch (err: any) {
        setError("Failed to load package details.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackage();
  }, [id]);

  if (loading) return <div style={stateStyle}>Loading package details...</div>;
  if (error) return <div style={{ ...stateStyle, color: "#b91c1c" }}>{error}</div>;
  if (!pkg) return <div style={stateStyle}>Package not found.</div>;

  return (
    <div style={pageStyle}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>Back</button>

      <main style={detailShellStyle}>
        <section style={mediaPanelStyle}>
          {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
            <img src={pkg.imageUrls[0]} alt={pkg.name} style={imageStyle} />
          ) : (
            <div style={placeholderStyle}>No Image</div>
          )}
        </section>

        <section style={infoPanelStyle}>
          <span style={badgeStyle}>{pkg.category}</span>
          <h1 style={titleStyle}>{pkg.name}</h1>
          <p style={providerStyle}>Provided by {pkg.providerName || "AudioRent partner"}</p>

          <div style={metaGridStyle}>
            <div style={metaItemStyle}>
              <span style={metaLabelStyle}>Daily Rate</span>
              <strong style={metaValueStyle}>${pkg.price}</strong>
            </div>
            <div style={metaItemStyle}>
              <span style={metaLabelStyle}>Available Qty</span>
              <strong style={metaValueStyle}>{pkg.quantity}</strong>
            </div>
          </div>

          <div style={descriptionBlockStyle}>
            <h2 style={sectionTitleStyle}>Description</h2>
            <p style={descriptionStyle}>{pkg.description}</p>
          </div>

          <Link to={`/packages/${pkg.id}/book`} style={bookButtonStyle}>Rent Now</Link>
        </section>
      </main>
    </div>
  );
};

const pageStyle: React.CSSProperties = {
  minHeight: "calc(100vh - 64px)",
  padding: "40px clamp(20px, 8vw, 120px) 64px",
  backgroundColor: "#f5f7fb"
};

const detailShellStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 1.05fr) minmax(320px, 0.95fr)",
  gap: "28px",
  maxWidth: "1120px",
  margin: "0 auto"
};

const mediaPanelStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
  minHeight: "420px",
  overflow: "hidden"
};

const imageStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };
const placeholderStyle: React.CSSProperties = { height: "100%", minHeight: "420px", display: "grid", placeItems: "center", color: "#9ca3af", backgroundColor: "#f3f4f6" };

const infoPanelStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.08)",
  padding: "34px"
};

const backButtonStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#374151",
  cursor: "pointer",
  fontWeight: 800,
  margin: "0 auto 20px",
  display: "block",
  maxWidth: "1120px",
  padding: "10px 16px"
};

const badgeStyle: React.CSSProperties = {
  backgroundColor: "#ccfbf1",
  borderRadius: "999px",
  color: "#0f766e",
  display: "inline-block",
  fontSize: "0.75rem",
  fontWeight: 900,
  marginBottom: "18px",
  padding: "7px 12px"
};

const titleStyle: React.CSSProperties = { color: "#111827", fontSize: "2.25rem", lineHeight: 1.08, margin: "0 0 10px", fontWeight: 900 };
const providerStyle: React.CSSProperties = { color: "#6b7280", margin: "0 0 26px" };
const metaGridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px" };
const metaItemStyle: React.CSSProperties = { backgroundColor: "#f9fafb", border: "1px solid #eef0f3", borderRadius: "8px", padding: "16px" };
const metaLabelStyle: React.CSSProperties = { color: "#6b7280", display: "block", fontSize: "0.75rem", fontWeight: 800, marginBottom: "8px", textTransform: "uppercase" };
const metaValueStyle: React.CSSProperties = { color: "#111827", fontSize: "1.5rem", fontWeight: 900 };
const descriptionBlockStyle: React.CSSProperties = { marginBottom: "30px" };
const sectionTitleStyle: React.CSSProperties = { color: "#111827", fontSize: "1rem", fontWeight: 900, margin: "0 0 10px" };
const descriptionStyle: React.CSSProperties = { color: "#4b5563", lineHeight: 1.7, margin: 0 };

const bookButtonStyle: React.CSSProperties = {
  backgroundColor: "#111827",
  borderRadius: "8px",
  color: "#fff",
  display: "block",
  fontWeight: 900,
  padding: "15px 18px",
  textAlign: "center",
  textDecoration: "none"
};

const stateStyle: React.CSSProperties = {
  minHeight: "calc(100vh - 64px)",
  display: "grid",
  placeItems: "center",
  color: "#6b7280"
};

export default PackageDetail;
