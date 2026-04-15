import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [pkg, setPkg] = useState<any>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await api.get(`/packages/${id}`);
        setPkg(response.data);
      } catch (err) {
        setError("Failed to load package details.");
      }
    };
    fetchPackage();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && pkg) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTotalPrice(diffDays * pkg.price);
      } else {
        setTotalPrice(0);
      }
    }
  }, [startDate, endDate, pkg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setError("Start date cannot be in the past.");
      return;
    }
    if (end <= start) {
      setError("End date must be after start date.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/rentals", {
        packageId: id,
        startDate,
        endDate,
        notes
      });
      alert("Booking confirmed!");
      navigate("/my-rentals");
    } catch (err: any) {
      setError(err.response?.data || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#fff" }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>Back</button>
      <h2 style={{ textAlign: "center" }}>Book Package: {pkg.name}</h2>
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "18px" }}>${pkg.price} / day</p>

      {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={labelStyle}>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Total Price</label>
          <div style={{ fontSize: "20px", fontWeight: "bold", padding: "10px", backgroundColor: "#eee", borderRadius: "4px" }}>
            ${totalPrice.toFixed(2)}
          </div>
        </div>
        <div>
          <label style={labelStyle}>Additional Notes (Optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} style={{ ...inputStyle, minHeight: "80px" }} />
        </div>
        <button type="submit" disabled={loading} style={submitButtonStyle}>
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </form>
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

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "bold" as const
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  boxSizing: "border-box" as const
};

const submitButtonStyle = {
  padding: "15px",
  backgroundColor: "#000",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold" as const,
  fontSize: "16px",
  borderRadius: "4px",
  marginTop: "10px"
};

export default Booking;
