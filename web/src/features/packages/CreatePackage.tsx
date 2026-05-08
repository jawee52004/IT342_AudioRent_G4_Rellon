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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
    <div style={pageStyle}>
      <header style={pageHeaderStyle}>
        <button onClick={() => navigate(-1)} style={backBtnStyle}>Back</button>
        <p style={eyebrowStyle}>New listing</p>
        <h1 style={titleStyle}>Add New Equipment</h1>
        <p style={subtitleStyle}>Create a customer-ready package with clear specs, pricing, stock, and photos.</p>
      </header>

      <main style={shellStyle}>
        <section style={guidePanelStyle}>
          <h2 style={guideTitleStyle}>Listing checklist</h2>
          <ul style={guideListStyle}>
            <li>Use a clear package title customers can recognize.</li>
            <li>Choose one of the approved event-size categories.</li>
            <li>Add photos that show the actual equipment condition.</li>
            <li>Keep quantity updated so customers only book available stock.</li>
          </ul>
        </section>

        <section style={formCardStyle}>
          {error && <div style={errorStyle}>{error}</div>}

          <form onSubmit={handleSubmit} style={formStyle}>
            <div style={inputGroupStyle}>
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

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} required style={inputStyle}>
                <option value="">Select category</option>
                <option value="Basic (Small Events)">Basic (Small Events)</option>
                <option value="Standard (Medium Events)">Standard (Medium Events)</option>
                <option value="Professional (Large Events)">Professional (Large Events)</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea
                name="description"
                placeholder="Detail the specs, condition, and what's included..."
                value={formData.description}
                onChange={handleInputChange}
                required
                style={textareaStyle}
              />
            </div>

            <div style={rowStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Daily Rate ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" required style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Inventory Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" required style={inputStyle} />
              </div>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Equipment Photos</label>
              <div style={fileUploadWrapperStyle}>
                <input type="file" multiple accept="image/png, image/jpeg" onChange={handleFileChange} style={fileInputStyle} />
                <p style={fileHintStyle}>PNG or JPEG, up to 5 files.</p>
              </div>
            </div>

            <button type="submit" disabled={loading} style={submitBtnStyle}>
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

const pageStyle: React.CSSProperties = {
  backgroundColor: "#f5f7fb",
  minHeight: "100vh",
  padding: "40px clamp(20px, 5vw, 72px) 64px",
  fontFamily: "Inter, Arial, sans-serif"
};

const pageHeaderStyle: React.CSSProperties = { marginBottom: "24px", maxWidth: "1120px" };
const backBtnStyle: React.CSSProperties = { background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontSize: "0.9rem", fontWeight: 800, margin: "0 0 20px", padding: 0 };
const eyebrowStyle: React.CSSProperties = { color: "#0f766e", fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.08em", margin: "0 0 10px", textTransform: "uppercase" };
const titleStyle: React.CSSProperties = { color: "#111827", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 900, lineHeight: 1.05, margin: "0 0 10px" };
const subtitleStyle: React.CSSProperties = { color: "#6b7280", lineHeight: 1.6, margin: 0, maxWidth: "640px" };
const shellStyle: React.CSSProperties = { display: "grid", gap: "22px", gridTemplateColumns: "minmax(260px, 0.45fr) minmax(360px, 0.85fr)", maxWidth: "1120px" };
const guidePanelStyle: React.CSSProperties = { alignSelf: "start", background: "linear-gradient(135deg, #111827 0%, #1f2937 58%, #0f766e 100%)", borderRadius: "8px", boxShadow: "0 18px 40px rgba(15, 23, 42, 0.14)", color: "#fff", padding: "28px" };
const guideTitleStyle: React.CSSProperties = { fontSize: "1.2rem", fontWeight: 900, margin: "0 0 16px" };
const guideListStyle: React.CSSProperties = { color: "#d1d5db", lineHeight: 1.7, margin: 0, paddingLeft: "20px" };
const formCardStyle: React.CSSProperties = { backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)", padding: "28px" };
const errorStyle: React.CSSProperties = { backgroundColor: "#fef2f2", borderRadius: "8px", color: "#b91c1c", fontSize: "0.875rem", fontWeight: 800, marginBottom: "20px", padding: "12px", textAlign: "center" };
const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "20px" };
const inputGroupStyle: React.CSSProperties = { display: "flex", flex: 1, flexDirection: "column", gap: "8px" };
const labelStyle: React.CSSProperties = { color: "#374151", fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase" };
const inputStyle: React.CSSProperties = { backgroundColor: "#fff", border: "1px solid #d1d5db", borderRadius: "8px", color: "#111827", fontSize: "1rem", outline: "none", padding: "13px 14px" };
const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: "130px", resize: "vertical" };
const rowStyle: React.CSSProperties = { display: "flex", gap: "16px" };
const fileUploadWrapperStyle: React.CSSProperties = { backgroundColor: "#f9fafb", border: "2px dashed #d1d5db", borderRadius: "8px", padding: "22px", textAlign: "center" };
const fileInputStyle: React.CSSProperties = { width: "100%" };
const fileHintStyle: React.CSSProperties = { color: "#9ca3af", fontSize: "0.8rem", margin: "8px 0 0" };
const submitBtnStyle: React.CSSProperties = { backgroundColor: "#111827", border: "none", borderRadius: "8px", color: "#fff", cursor: "pointer", fontSize: "1rem", fontWeight: 900, marginTop: "8px", padding: "15px" };

export default CreatePackage;
