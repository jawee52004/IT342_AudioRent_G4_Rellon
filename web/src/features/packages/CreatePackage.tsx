import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../common/api";

const CreatePackage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: ""
  });
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("quantity", formData.quantity);
    form.append("category", formData.category);

    if (images) {
      for (let i = 0; i < images.length; i++) {
        form.append("images", images[i]);
      }
    }

    try {
      await api.post("/packages", form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Equipment listed successfully!");
      navigate("/my-packages");
    } catch (err: any) {
      setError(err.response?.data || "Failed to list equipment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>← Back</button>
        <h2 style={titleStyle}>List New Equipment</h2>
        <p style={subtitleStyle}>Share your high-quality audio gear with the community.</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Equipment Title</label>
            <input 
              type="text" 
              name="name" 
              placeholder="e.g. JBL Professional SRX812P"
              value={formData.name} 
              onChange={handleInputChange} 
              required 
              style={inputStyle} 
            />
          </div>
          
          <div style={inputGroup}>
            <label style={labelStyle}>Category</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange as any} 
              required 
              style={inputStyle}
            >
              <option value="">Select Category</option>
              <option value="Basic (Small Events)">Basic (Small Events)</option>
              <option value="Standard (Medium Events)">Standard (Medium Events)</option>
              <option value="Professional (Large Events)">Professional (Large Events)</option>
            </select>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Description</label>
            <textarea 
              name="description" 
              placeholder="Detail the specs, condition, and what's included..."
              value={formData.description} 
              onChange={handleInputChange} 
              required 
              style={{ ...inputStyle, minHeight: "120px" }} 
            />
          </div>

          <div style={rowStyle}>
            <div style={{ ...inputGroup, flex: 1 }}>
              <label style={labelStyle}>Daily Rate ($)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleInputChange} 
                min="0" 
                step="0.01" 
                required 
                style={inputStyle} 
              />
            </div>
            <div style={{ ...inputGroup, flex: 1 }}>
              <label style={labelStyle}>Inventory Quantity</label>
              <input 
                type="number" 
                name="quantity" 
                value={formData.quantity} 
                onChange={handleInputChange} 
                min="1" 
                required 
                style={inputStyle} 
              />
            </div>
          </div>

          <div style={inputGroup}>
            <label style={labelStyle}>Equipment Photos</label>
            <div style={fileUploadWrapper}>
              <input 
                type="file" 
                multiple 
                accept="image/png, image/jpeg" 
                onChange={handleFileChange} 
                style={fileInputStyle} 
              />
              <p style={fileHint}>PNG or JPEG (max 5 files)</p>
            </div>
          </div>
          
          <button type="submit" disabled={loading} style={submitBtnStyle}>
            {loading ? "Publishing..." : "Publish Listing"}
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
  fontFamily: "'Outfit', sans-serif"
};

const cardStyle: React.CSSProperties = {
  maxWidth: "640px",
  margin: "0 auto",
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "24px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
};

const backBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#6b7280",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.875rem",
  marginBottom: "20px"
};

const titleStyle: React.CSSProperties = { fontSize: "2rem", fontWeight: "800", color: "#111827", margin: "0 0 8px 0" };
const subtitleStyle: React.CSSProperties = { color: "#6b7280", margin: "0 0 32px 0", fontSize: "0.95rem" };

const errorStyle: React.CSSProperties = {
  backgroundColor: "#fef2f2",
  color: "#b91c1c",
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "20px",
  textAlign: "center",
  fontSize: "0.875rem",
  fontWeight: "600"
};

const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "24px" };
const inputGroup: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
const labelStyle: React.CSSProperties = { fontSize: "0.875rem", fontWeight: "600", color: "#374151" };

const inputStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  fontSize: "1rem",
  color: "#111827",
  backgroundColor: "#fcfcfc",
  transition: "border-color 0.2s",
  outline: "none"
};

const rowStyle: React.CSSProperties = { display: "flex", gap: "20px" };

const fileUploadWrapper: React.CSSProperties = {
  border: "2px dashed #e5e7eb",
  padding: "20px",
  borderRadius: "12px",
  textAlign: "center",
  backgroundColor: "#f9fafb"
};

const fileInputStyle: React.CSSProperties = { width: "100%", cursor: "pointer" };
const fileHint: React.CSSProperties = { fontSize: "0.75rem", color: "#9ca3af", marginTop: "8px", margin: "8px 0" };

const submitBtnStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "16px",
  backgroundColor: "#111827",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  fontSize: "1rem",
  fontWeight: "700",
  cursor: "pointer",
  transition: "transform 0.1s"
};

export default CreatePackage;
