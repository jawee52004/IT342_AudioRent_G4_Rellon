import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

interface Rental {
  id: string;
  packageName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalPrice: number;
  status: string;
}

const RentalHistory: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await api.get("/rentals");
        setRentals(response.data);
      } catch (err: any) {
        setError("Failed to load rental history.");
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>Back</button>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>My Rental History</h2>
      
      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      
      {!loading && rentals.length === 0 && (
        <p style={{ textAlign: "center" }}>You have no rentals yet.</p>
      )}

      {rentals.map((rental) => (
        <div key={rental.id} style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ margin: 0 }}>{rental.packageName}</h3>
            <span style={{ ...badgeStyle, backgroundColor: getStatusColor(rental.status) }}>{rental.status}</span>
          </div>
          <p style={{ margin: "5px 0" }}><strong>Dates:</strong> {rental.startDate} to {rental.endDate} ({rental.totalDays} days)</p>
          <p style={{ margin: "5px 0" }}><strong>Total Price:</strong> ${rental.totalPrice.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING": return "orange";
    case "CONFIRMED": return "green";
    case "CANCELLED": return "red";
    case "COMPLETED": return "blue";
    default: return "gray";
  }
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

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "15px",
  backgroundColor: "#f9f9f9",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
};

const badgeStyle = {
  padding: "5px 10px",
  color: "#fff",
  borderRadius: "15px",
  fontSize: "12px",
  fontWeight: "bold" as const
};

export default RentalHistory;
