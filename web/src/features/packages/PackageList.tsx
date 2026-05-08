import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../common/api";

interface Package {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  quantity?: number;
  imageUrls: string[];
}

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  useEffect(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const nextPackages = packages.filter((pkg) => {
      if (pkg.category === "Speakers") return false;
      const matchesCategory = selectedCategory === "All" || pkg.category === selectedCategory;
      const searchableText = `${pkg.name} ${pkg.category} ${pkg.description ?? ""}`.toLowerCase();
      return matchesCategory && searchableText.includes(normalizedSearch);
    });

    setFilteredPackages(nextPackages);
  }, [packages, searchTerm, selectedCategory]);

  const categories = [
    "All",
    ...Array.from(new Set(packages.map(pkg => pkg.category).filter(Boolean))).filter(category => category !== "Speakers")
  ];

  return (
    <div style={containerStyle}>
      <header style={pageHeaderStyle}>
        <p style={eyebrowStyle}>Browse packages</p>
        <h1 style={pageTitleStyle}>Find a sound system for your event</h1>
        <p style={pageSubtitleStyle}>Search available audio packages and filter by event size or category.</p>
      </header>

      <section style={toolbarStyle}>
        <input
          aria-label="Search packages"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search sound system packages..."
          style={searchInputStyle}
        />
        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(event) => setSelectedCategory(event.target.value)}
          style={selectStyle}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </section>

      {loading && <div style={msgBox}>Loading available equipment...</div>}
      {error && <div style={{ ...msgBox, color: "#dc2626" }}>{error}</div>}

      <main style={contentStyle}>
        <div style={sectionHeaderStyle}>
          <h1 style={titleStyle}>Available Packages</h1>
          <span style={countStyle}>{filteredPackages.length} shown</span>
        </div>

        <div style={gridStyle}>
          {filteredPackages.map((pkg) => (
            <Link key={pkg.id} to={`/packages/${pkg.id}`} style={cardStyle}>
              <div style={imageWrapStyle}>
                {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
                  <img src={pkg.imageUrls[0]} alt={pkg.name} style={imageStyle} />
                ) : (
                  <div style={placeholderStyle}>No Image</div>
                )}
                <span style={availabilityBadge}>
                  {pkg.quantity === 0 ? "Unavailable" : "Available"}
                </span>
              </div>
              <div style={cardInfo}>
                <h2 style={pkgTitle}>{pkg.name}</h2>
                <p style={descriptionStyle}>
                  {pkg.description || `Professional audio package for ${pkg.category.toLowerCase()}.`}
                </p>
                <div style={cardFooterStyle}>
                  <span style={categoryText}>{pkg.category}</span>
                  <span style={detailsText}>View</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {!loading && filteredPackages.length === 0 && (
        <div style={emptyState}>No equipment found in this category.</div>
      )}
    </div>
  );
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#f6f7f9",
  minHeight: "calc(100vh - 64px)",
  padding: "40px 20px 64px",
  fontFamily: "Arial, sans-serif"
};

const pageHeaderStyle: React.CSSProperties = {
  maxWidth: "1120px",
  margin: "0 auto 28px"
};

const eyebrowStyle: React.CSSProperties = {
  color: "#0f766e",
  fontSize: "0.78rem",
  fontWeight: 900,
  letterSpacing: "0.08em",
  margin: "0 0 10px",
  textTransform: "uppercase"
};

const pageTitleStyle: React.CSSProperties = {
  color: "#111827",
  fontSize: "clamp(2rem, 4vw, 3rem)",
  fontWeight: 900,
  lineHeight: 1.05,
  margin: "0 0 10px"
};

const pageSubtitleStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "1rem",
  lineHeight: 1.6,
  margin: 0
};

const toolbarStyle: React.CSSProperties = {
  maxWidth: "1120px",
  margin: "0 auto 30px",
  display: "flex",
  flexWrap: "wrap",
  gap: "14px",
  alignItems: "center"
};

const searchInputStyle: React.CSSProperties = {
  flex: "1 1 320px",
  minWidth: 0,
  height: "48px",
  border: "none",
  borderRadius: "999px",
  backgroundColor: "#fff",
  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.12)",
  color: "#111827",
  fontSize: "0.92rem",
  outline: "none",
  padding: "0 24px",
  boxSizing: "border-box"
};

const selectStyle: React.CSSProperties = {
  flex: "0 1 240px",
  height: "46px",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  backgroundColor: "#fff",
  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.08)",
  color: "#374151",
  fontSize: "0.9rem",
  outline: "none",
  padding: "0 14px"
};

const contentStyle: React.CSSProperties = {
  maxWidth: "1120px",
  margin: "0 auto",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  padding: "30px"
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "22px"
};

const titleStyle: React.CSSProperties = {
  color: "#111827",
  fontSize: "1.55rem",
  fontWeight: 800,
  margin: 0
};

const countStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "0.85rem",
  fontWeight: 700
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "20px"
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 6px 16px rgba(15, 23, 42, 0.1)",
  border: "1px solid #eef0f3",
  color: "inherit",
  textDecoration: "none"
};

const imageWrapStyle: React.CSSProperties = {
  height: "160px",
  position: "relative",
  backgroundColor: "#f3f4f6"
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "block",
  objectFit: "cover"
};

const placeholderStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  backgroundColor: "#f3f4f6",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#9ca3af"
};

const availabilityBadge: React.CSSProperties = {
  position: "absolute",
  top: "10px",
  right: "10px",
  backgroundColor: "#fff",
  borderRadius: "5px",
  boxShadow: "0 5px 14px rgba(15, 23, 42, 0.16)",
  color: "#111827",
  fontSize: "0.72rem",
  fontWeight: 800,
  padding: "6px 9px"
};

const cardInfo: React.CSSProperties = {
  padding: "18px 18px 16px"
};

const pkgTitle: React.CSSProperties = {
  color: "#111827",
  fontSize: "1.05rem",
  fontWeight: 800,
  lineHeight: 1.25,
  minHeight: "2.6em",
  margin: "0 0 10px"
};

const descriptionStyle: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "0.82rem",
  lineHeight: 1.5,
  height: "3.9em",
  margin: "0 0 16px",
  overflow: "hidden"
};

const cardFooterStyle: React.CSSProperties = {
  alignItems: "center",
  borderTop: "1px solid #f1f3f5",
  display: "flex",
  gap: "10px",
  justifyContent: "space-between",
  paddingTop: "12px"
};

const categoryText: React.CSSProperties = {
  color: "#4b5563",
  fontSize: "0.75rem",
  fontWeight: 700,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap"
};

const detailsText: React.CSSProperties = {
  color: "#111827",
  fontSize: "0.8rem",
  fontWeight: 800
};

const msgBox: React.CSSProperties = { textAlign: "center", padding: "60px", color: "#6b7280" };
const emptyState: React.CSSProperties = { ...msgBox, gridColumn: "1 / -1" };

export default PackageList;
