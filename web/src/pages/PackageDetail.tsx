import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";

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

  if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center", marginTop: "50px" }}>{error}</div>;
  if (!pkg) return <div style={{ textAlign: "center", marginTop: "50px" }}>Package not found.</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>Back</button>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        <div style={{ flex: "1 1 300px" }}>
          {pkg.imageUrls && pkg.imageUrls.length > 0 ? (
            <img src={pkg.imageUrls[0]} alt={pkg.name} style={{ width: "100%", borderRadius: "8px", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "300px", backgroundColor: "#eee", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>No Image</div>
          )}
        </div>
        <div style={{ flex: "2 1 300px" }}>
          <h2 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>{pkg.name}</h2>
          <p style={{ color: "#555", fontStyle: "italic", marginBottom: "20px" }}>Provider: {pkg.providerName}</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: "0 0 20px 0" }}>${pkg.price} / day</p>
          <p style={{ marginBottom: "10px" }}><strong>Category:</strong> {pkg.category}</p>
          <p style={{ marginBottom: "20px" }}><strong>Available Qty:</strong> {pkg.quantity}</p>
          <div style={{ marginBottom: "30px", lineHeight: "1.6" }}>
            <strong>Description:</strong><br />
            {pkg.description}
          </div>
          
          <Link to={`/packages/${pkg.id}/book`} style={bookButtonStyle}>Rent Now</Link>
        </div>
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
  fontWeight: "bold" as const,
  borderRadius: "4px"
};

const bookButtonStyle = {
  display: "inline-block",
  backgroundColor: "#000",
  color: "#fff",
  padding: "15px 30px",
  textDecoration: "none",
  fontWeight: "bold" as const,
  fontSize: "18px",
  borderRadius: "4px"
};

export default PackageDetail;
