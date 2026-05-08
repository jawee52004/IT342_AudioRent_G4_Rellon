import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div style={containerStyle}>
      <section style={heroStyle}>
        <div>
          <p style={eyebrowStyle}>Customer workspace</p>
          <h1 style={titleStyle}>Welcome back, {userName || "Valued User"}</h1>
          <p style={subtitleStyle}>Find event-ready audio packages, review your rental history, and move from planning to booked with less friction.</p>
          <div style={actionRowStyle}>
            <button onClick={() => navigate("/packages")} style={primaryBtn}>Browse Equipment</button>
            <button onClick={() => navigate("/my-rentals")} style={secondaryBtn}>Rental History</button>
          </div>
        </div>
      </section>

      <section style={quickGridStyle}>
        <article style={quickCardStyle}>
          <span style={statStyle}>01</span>
          <h2 style={cardTitleStyle}>Choose a package</h2>
          <p style={cardCopyStyle}>Search by package name or category and compare available sound system bundles.</p>
        </article>
        <article style={quickCardStyle}>
          <span style={statStyle}>02</span>
          <h2 style={cardTitleStyle}>Pick rental dates</h2>
          <p style={cardCopyStyle}>Check availability before confirming your booking request.</p>
        </article>
        <article style={quickCardStyle}>
          <span style={statStyle}>03</span>
          <h2 style={cardTitleStyle}>Track status</h2>
          <p style={cardCopyStyle}>Follow pending, confirmed, and completed rentals from your history page.</p>
        </article>
      </section>
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  minHeight: "calc(100vh - 64px)",
  padding: "42px clamp(20px, 8vw, 120px) 64px",
  backgroundColor: "#f5f7fb"
};

const heroStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #111827 0%, #1f2937 58%, #0f766e 100%)",
  borderRadius: "8px",
  color: "#fff",
  display: "grid",
  minHeight: "360px",
  padding: "56px",
  alignItems: "center",
  boxShadow: "0 20px 45px rgba(15, 23, 42, 0.18)"
};

const eyebrowStyle: React.CSSProperties = {
  color: "#99f6e4",
  fontSize: "0.78rem",
  fontWeight: 900,
  letterSpacing: "0.08em",
  margin: "0 0 14px",
  textTransform: "uppercase"
};

const titleStyle: React.CSSProperties = {
  fontSize: "clamp(2.1rem, 5vw, 4rem)",
  fontWeight: 900,
  lineHeight: 1,
  margin: "0 0 18px",
  maxWidth: "780px"
};

const subtitleStyle: React.CSSProperties = {
  color: "#d1d5db",
  fontSize: "1.04rem",
  lineHeight: 1.7,
  margin: 0,
  maxWidth: "620px"
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "14px",
  marginTop: "32px"
};

const primaryBtn: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "none",
  borderRadius: "8px",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 900,
  padding: "14px 22px"
};

const secondaryBtn: React.CSSProperties = {
  ...primaryBtn,
  backgroundColor: "transparent",
  border: "1px solid rgba(255,255,255,0.32)",
  color: "#fff"
};

const quickGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "18px",
  marginTop: "22px"
};

const quickCardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  padding: "24px"
};

const statStyle: React.CSSProperties = { color: "#0f766e", fontSize: "0.78rem", fontWeight: 900 };
const cardTitleStyle: React.CSSProperties = { color: "#111827", fontSize: "1.05rem", margin: "10px 0 8px", fontWeight: 900 };
const cardCopyStyle: React.CSSProperties = { color: "#6b7280", lineHeight: 1.6, margin: 0 };

export default Landing;
