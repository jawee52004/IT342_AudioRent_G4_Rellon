import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const Booking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [pkg, setPkg] = useState<any>(null);
  const [existingRentals, setExistingRentals] = useState<any[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pkgRes, rentalsRes] = await Promise.all([
          api.get(`/packages/${id}`),
          api.get(`/rentals/package/${id}`)
        ]);
        setPkg(pkgRes.data);
        setExistingRentals(rentalsRes.data);
      } catch (err) {
        setError("Failed to load package details.");
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (startDate && endDate && pkg) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end > start) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setTotalPrice(diffDays * pkg.price);
        
        // Check for conflicts
        if (checkConflicts(startDate, endDate)) {
          setError("Requested dates are unavailable. Please try another range.");
        } else {
          setError(null);
        }
      } else {
        setTotalPrice(0);
        setError(null);
      }
    }
  }, [startDate, endDate, pkg, existingRentals]);

  const checkConflicts = (startStr: string, endStr: string) => {
    if (!pkg || !existingRentals) return false;
    
    const reqStart = new Date(startStr);
    const reqEnd = new Date(endStr);
    
    // For each day in the requested range
    let current = new Date(reqStart);
    while (current <= reqEnd) {
      const dateStr = current.toISOString().split("T")[0];
      
      // Count rentals overlapping this specific day
      const overlapping = existingRentals.filter(r => {
        if (r.status !== "CONFIRMED" && r.status !== "PENDING") return false;
        const rStart = new Date(r.startDate);
        const rEnd = new Date(r.endDate);
        return current >= rStart && current <= rEnd;
      });
      
      if (overlapping.length >= pkg.quantity) {
        return true; // Conflict found
      }
      
      current.setDate(current.getDate() + 1);
    }
    return false;
  };

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
    
    if (checkConflicts(startDate, endDate)) {
      setError("Dates were just booked by someone else. Please refresh and try again.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/rentals", {
        packageId: id,
        startDate,
        endDate,
        notes
      });
      
      const rentalId = response.data.id;
      
      // Trigger payment process
      try {
        await api.post("/api/v1/payments", { rentalId });
        alert("Booking confirmed and payment processed successfully!");
      } catch (payErr: any) {
        console.error("Payment failed:", payErr);
        alert("Booking created but payment failed. Please check your rental history.");
      }
      
      navigate("/my-rentals", { replace: true });
    } catch (err: any) {
      setError(err.response?.data || "Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!pkg) return <div style={loadingOverlay}>Loading...</div>;

  return (
    <div style={containerStyle}>
      <div style={bookingCard}>
        <button onClick={() => navigate(-1)} style={backBtn}>&larr; Back</button>
        
        <header style={headerStyle}>
          <h2 style={titleStyle}>{pkg.name}</h2>
          <p style={priceStyle}>${pkg.price} <span style={{ fontSize: "0.875rem", fontWeight: "400" }}>/ day</span></p>
        </header>

        {error && <div style={errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={inputStyle} />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>End Date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={inputStyle} />
          </div>
          
          <div style={summaryBox}>
            <span style={summaryLabel}>Total Estimate</span>
            <span style={summaryValue}>${totalPrice.toFixed(2)}</span>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Special Instructions</label>
            <textarea 
              placeholder="e.g. Preferred delivery time, site access info..."
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              style={textareaStyle} 
            />
          </div>

          <button type="submit" disabled={loading} style={submitBtn}>
            {loading ? "Processing..." : "Confirm & Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  minHeight: "100vh",
  padding: "60px 20px",
  display: "flex",
  justifyContent: "center",
  fontFamily: "'Outfit', sans-serif"
};

const bookingCard: React.CSSProperties = {
  maxWidth: "520px",
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: "32px",
  padding: "40px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)"
};

const backBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#6b7280",
  fontSize: "0.875rem",
  fontWeight: "600",
  cursor: "pointer",
  marginBottom: "24px"
};

const headerStyle: React.CSSProperties = { textAlign: "center", marginBottom: "32px" };
const titleStyle: React.CSSProperties = { fontSize: "1.75rem", fontWeight: "800", color: "#111827", margin: "0 0 4px 0" };
const priceStyle: React.CSSProperties = { fontSize: "1.25rem", fontWeight: "700", color: "#6b7280" };

const errorAlert: React.CSSProperties = {
  padding: "16px",
  backgroundColor: "#fef2f2",
  color: "#dc2626",
  borderRadius: "16px",
  fontSize: "0.875rem",
  fontWeight: "600",
  marginBottom: "24px",
  textAlign: "center"
};

const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle: React.CSSProperties = { fontSize: "0.75rem", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase" };

const inputStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  fontSize: "1rem",
  fontFamily: "inherit"
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: "100px",
  resize: "vertical"
};

const summaryBox: React.CSSProperties = {
  padding: "24px",
  backgroundColor: "#f9fafb",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const summaryLabel: React.CSSProperties = { fontSize: "0.875rem", fontWeight: "600", color: "#6b7280" };
const summaryValue: React.CSSProperties = { fontSize: "1.5rem", fontWeight: "800", color: "#111827" };

const submitBtn: React.CSSProperties = {
  padding: "18px",
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "12px"
};

const loadingOverlay: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "1.125rem",
  fontFamily: "'Outfit', sans-serif"
};

export default Booking;
