import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../common/api";

interface Package {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrls: string[];
}

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get("/packages");
        setPackages(response.data);
        setFilteredPackages(response.data);
      } catch (err: any) {
        setError("Failed to load packages.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredPackages(packages);
    } else {
      setFilteredPackages(packages.filter(p => p.category === category));
    }
  };

  const categories = ["All", "Basic (Small Events)", "Standard (Medium Events)", "Professional (Large Events)"];

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>← Back</button>
        <h1 style={titleStyle}>Discover Premium Audio Gear</h1>
        <p style={subtitleStyle}>Professional sound solutions for every occasion.</p>
      </header>

      <div style={filterContainer}>
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => handleFilter(cat)}
            style={selectedCategory === cat ? activeFilterBtn : filterBtn}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {loading && <div style={msgBox}>Loading available equipment...</div>}
      {error && <div style={{ ...msgBox, color: "#dc2626" }}>{error}</div>}
      
      <div style={gridStyle}>
        {filteredPackages.map((pkg) => (
          <div key={pkg.id} style={cardStyle}>
            {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
              <img src={pkg.imageUrls[0]} alt={pkg.name} style={imageStyle} />
            ) : (
              <div style={placeholderStyle}>No Image</div>
            )}
            <div style={cardInfo}>
              <span style={categoryBadge}>{pkg.category}</span>
              <h3 style={pkgTitle}>{pkg.name}</h3>
              <div style={priceRow}>
                <span style={priceText}>${pkg.price.toFixed(2)}</span>
                <span style={perDay}>/ day</span>
              </div>
              <Link to={`/packages/${pkg.id}`} style={detailsBtn}>View Selection</Link>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && filteredPackages.length === 0 && (
        <div style={emptyState}>No equipment found in this category.</div>
      )}
    </div>
  );
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  padding: "60px 20px",
  fontFamily: "'Outfit', sans-serif"
};

const headerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto 40px auto",
  textAlign: "center"
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#6b7280",
  fontSize: "0.875rem",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "20px"
};

const titleStyle: React.CSSProperties = { fontSize: "3rem", fontWeight: "800", color: "#111827", marginBottom: "12px" };
const subtitleStyle: React.CSSProperties = { fontSize: "1.125rem", color: "#6b7280" };

const filterContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "48px",
  flexWrap: "wrap"
};

const filterBtn: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "30px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#fff",
  color: "#374151",
  fontWeight: "600",
  fontSize: "0.875rem",
  cursor: "pointer",
  transition: "all 0.2s"
};

const activeFilterBtn: React.CSSProperties = {
  ...filterBtn,
  backgroundColor: "#111827",
  color: "#fff",
  borderColor: "#111827"
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "32px",
  maxWidth: "1200px",
  margin: "0 auto"
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "24px",
  overflow: "hidden",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
  border: "1px solid #f3f4f6",
  transition: "transform 0.2s"
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "220px",
  objectFit: "cover"
};

const placeholderStyle: React.CSSProperties = {
  width: "100%",
  height: "220px",
  backgroundColor: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#9ca3af"
};

const cardInfo: React.CSSProperties = { padding: "24px" };

const categoryBadge: React.CSSProperties = {
  display: "inline-block",
  padding: "4px 12px",
  backgroundColor: "#f3f4f6",
  color: "#6b7280",
  fontSize: "0.75rem",
  fontWeight: "700",
  borderRadius: "20px",
  textTransform: "uppercase",
  marginBottom: "12px"
};

const pkgTitle: React.CSSProperties = { fontSize: "1.25rem", fontWeight: "700", color: "#111827", marginBottom: "16px", height: "1.5em", overflow: "hidden" };

const priceRow: React.CSSProperties = { display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "24px" };
const priceText: React.CSSProperties = { fontSize: "1.5rem", fontWeight: "800", color: "#111827" };
const perDay: React.CSSProperties = { fontSize: "0.875rem", color: "#6b7280" };

const detailsBtn: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "14px",
  backgroundColor: "#111827",
  color: "#fff",
  textAlign: "center",
  textDecoration: "none",
  borderRadius: "14px",
  fontWeight: "700",
  fontSize: "0.95rem"
};

const msgBox: React.CSSProperties = { textAlign: "center", padding: "60px", color: "#6b7280" };
const emptyState: React.CSSProperties = { ...msgBox, gridColumn: "1 / -1" };

export default PackageList;
