import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

interface Package {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: string;
  isActive: boolean;
}

const MyPackages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/packages/my");
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
        await api.delete(`/packages/${id}`);
        setPackages(packages.filter((pkg) => pkg.id !== id));
      } catch (err) {
        alert("Failed to delete package.");
      }
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>Back to Dashboard</button>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>My Packages</h2>
        <Link to="/packages/create" style={createButtonStyle}>Create New Package</Link>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {!loading && packages.length === 0 && (
        <p>You haven't listed any packages yet.</p>
      )}

      {packages.map((pkg) => (
        <div key={pkg.id} style={cardStyle}>
          <div style={{ flexGrow: 1 }}>
            <h3 style={{ margin: "0 0 10px 0" }}>{pkg.name}</h3>
            <p style={{ margin: "5px 0" }}><strong>Price:</strong> ${pkg.price} / day</p>
            <p style={{ margin: "5px 0" }}><strong>Quantity:</strong> {pkg.quantity}</p>
            <p style={{ margin: "5px 0" }}><strong>Status:</strong> {pkg.isActive ? "Active" : "Inactive"}</p>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Link to={`/packages/${pkg.id}/edit`} style={editButtonStyle}>Edit</Link>
            <button onClick={() => handleDelete(pkg.id)} style={deleteButtonStyle}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

const backButtonStyle = {
  marginBottom: "20px",
  padding: "8px 16px",
  backgroundColor: "#ccc",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold" as const,
  borderRadius: "4px"
};

const createButtonStyle = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "10px 20px",
  textDecoration: "none",
  fontWeight: "bold" as const,
  borderRadius: "4px"
};

const cardStyle = {
  display: "flex",
  justifyContent: "space-between",
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "15px",
  backgroundColor: "#f9f9f9"
};

const editButtonStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  padding: "8px 16px",
  textDecoration: "none",
  borderRadius: "4px",
  border: "none",
  fontWeight: "bold" as const
};

const deleteButtonStyle = {
  backgroundColor: "#f44336",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold" as const
};

export default MyPackages;
