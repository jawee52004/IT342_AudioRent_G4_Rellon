import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const EditPackage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await api.get(`/packages/${id}`);
        const pkg = response.data;
        setFormData({
          name: pkg.name,
          description: pkg.description,
          price: pkg.price.toString(),
          quantity: pkg.quantity.toString(),
          category: pkg.category
        });
      } catch (err) {
        setError("Failed to load package details.");
      } finally {
        setFetching(false);
      }
    };
    fetchPackage();
  }, [id]);

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
      await api.put(`/packages/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Package updated successfully!");
      navigate("/my-packages");
    } catch (err: any) {
      setError(err.response?.data || "Failed to update package.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", fontFamily: "Arial, sans-serif", border: "1px solid #ddd", borderRadius: "8px" }}>
      <button onClick={() => navigate(-1)} style={backButtonStyle}>Back</button>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Edit Package</h2>

      {error && <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label style={labelStyle}>Package Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required style={{ ...inputStyle, minHeight: "80px" }} />
        </div>
        <div>
          <label style={labelStyle}>Price per Day ($)</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Quantity Available</label>
          <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="1" required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <input type="text" name="category" value={formData.category} onChange={handleInputChange} required style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>New Images (Optional)</label>
          <input type="file" multiple accept="image/png, image/jpeg" onChange={handleFileChange} style={inputStyle} />
        </div>
        
        <button type="submit" disabled={loading} style={submitButtonStyle}>
          {loading ? "Saving..." : "Update Package"}
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

export default EditPackage;
