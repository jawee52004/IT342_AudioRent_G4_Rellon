import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

interface Package {
  id: string;
  name: string;
  price: number;
  imageUrls: string[];
}

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get("/packages");
        setPackages(response.data);
      } catch (err: any) {
        setError("Failed to load packages.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", backgroundColor: "#f9f9f9", minHeight: "100vh" }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>Back</button>
      <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px" }}>Available Packages</h2>
      
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        {packages.map((pkg) => (
          <div key={pkg.id} style={cardStyle}>
            {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
              <img src={pkg.imageUrls[0]} alt={pkg.name} style={imageStyle} />
            ) : (
              <div style={placeholderStyle}>No Image</div>
            )}
            <div style={{ padding: "15px" }}>
              <h3 style={{ margin: "0 0 10px 0" }}>{pkg.name}</h3>
              <p style={{ margin: "0 0 15px 0", fontWeight: "bold" }}>${pkg.price} / day</p>
              <Link to={`/packages/${pkg.id}`} style={linkButtonStyle}>View Details</Link>
            </div>
          </div>
        ))}
        {!loading && packages.length === 0 && <p>No packages available at the moment.</p>}
      </div>
    </div>
  );
};

const backButtonStyle = {
  marginBottom: "20px",
  padding: "10px 20px",
  backgroundColor: "#ccc",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold" as const
};

const cardStyle = {
  width: "300px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  overflow: "hidden",
  backgroundColor: "#fff",
  boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover" as const
};

const placeholderStyle = {
  width: "100%",
  height: "200px",
  backgroundColor: "#eee",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#999"
};

const linkButtonStyle = {
  display: "block",
  textAlign: "center" as const,
  backgroundColor: "#000",
  color: "#fff",
  textDecoration: "none",
  padding: "10px",
  borderRadius: "4px",
  fontWeight: "bold" as const
};

export default PackageList;
