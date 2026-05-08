import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../../common/ApiService";

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
}

interface Package {
  id: string;
  name: string;
  providerName: string;
  price: number;
  category: string;
  isActive: boolean;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const userRole = localStorage.getItem("userRole");
  const apiService = ApiService.getInstance();

  const [users, setUsers] = useState<User[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"users" | "packages">("users");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || userRole !== "ADMIN") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [navigate, userRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, pkgsRes] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getAllAdminPackages()
      ]);
      setUsers(usersRes.data);
      setPackages(pkgsRes.data);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await apiService.deactivateUser(userId);
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: false } : u));
    } catch (err) {
      alert("Failed to deactivate user");
    }
  };

  const handleDeletePackage = async (pkgId: string) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await apiService.deletePackage(pkgId);
      setPackages(packages.filter(p => p.id !== pkgId));
    } catch (err) {
      alert("Failed to delete package");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f8f9fa" }}>
      <div className="spinner">Loading Dashboard...</div>
    </div>
  );

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div>
          <h1 style={titleStyle}>ADMIN PANEL</h1>
          <p style={subtitleStyle}>Welcome, {userName || "Administrator"}</p>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
      </header>

      <div style={statsGrid}>
        <div style={statCard}>
          <h3>Total Users</h3>
          <p style={statNumber}>{users.length}</p>
        </div>
        <div style={statCard}>
          <h3>Active Listings</h3>
          <p style={statNumber}>{packages.filter(p => p.isActive).length}</p>
        </div>
        <div style={statCard}>
          <h3>Inactive Listings</h3>
          <p style={statNumber}>{packages.filter(p => !p.isActive).length}</p>
        </div>
      </div>

      <div style={tabsContainer}>
        <button 
          onClick={() => setActiveTab("users")} 
          style={activeTab === "users" ? activeTabStyle : tabStyle}
        >
          User Management
        </button>
        <button 
          onClick={() => setActiveTab("packages")} 
          style={activeTab === "packages" ? activeTabStyle : tabStyle}
        >
          Package Moderation
        </button>
      </div>

      <main style={mainContentStyle}>
        {activeTab === "users" ? (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => u.id !== localStorage.getItem("userId"))
                  .map(user => (
                  <tr key={user.id}>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td><span style={roleBadgeStyle}>{user.role}</span></td>
                    <td>
                      <span style={user.isActive ? statusActiveStyle : statusInactiveStyle}>
                        {user.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td>
                      {user.isActive && (
                        <button 
                          onClick={() => handleDeactivateUser(user.id)}
                          style={deactivateButtonStyle}
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={tableWrapper}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Package Name</th>
                  <th>Provider</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id}>
                    <td>{pkg.name}</td>
                    <td>{pkg.providerName}</td>
                    <td>${pkg.price}/day</td>
                    <td>
                      <span style={pkg.isActive ? statusActiveStyle : statusInactiveStyle}>
                        {pkg.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeletePackage(pkg.id)}
                        style={deleteButtonStyle}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

// --- Styles ---

const containerStyle: React.CSSProperties = {
  padding: "40px",
  backgroundColor: "#f5f7fb",
  minHeight: "100vh",
  fontFamily: "Inter, Arial, sans-serif"
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "40px"
};

const titleStyle: React.CSSProperties = {
  fontSize: "2rem",
  fontWeight: "800",
  margin: 0,
  color: "#111827",
  letterSpacing: "0"
};

const subtitleStyle: React.CSSProperties = {
  color: "#6b7280",
  margin: "5px 0 0"
};

const logoutButtonStyle: React.CSSProperties = {
  padding: "10px 20px",
  backgroundColor: "#ef4444",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
  fontSize: "0.875rem",
  transition: "all 0.2s"
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "40px"
};

const statCard: React.CSSProperties = {
  padding: "20px",
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  textAlign: "left"
};

const statNumber: React.CSSProperties = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "10px 0 0",
  color: "#0f766e"
};

const tabsContainer: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
};

const tabStyle: React.CSSProperties = {
  padding: "12px 24px",
  border: "none",
  background: "none",
  cursor: "pointer",
  fontWeight: "600",
  color: "#666",
  borderRadius: "8px",
  transition: "all 0.2s"
};

const activeTabStyle: React.CSSProperties = {
  ...tabStyle,
  background: "#1a1a1a",
  color: "#fff"
};

const mainContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  overflow: "hidden"
};

const tableWrapper: React.CSSProperties = {
  overflowX: "auto"
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left"
};

const roleBadgeStyle: React.CSSProperties = {
  padding: "4px 8px",
  backgroundColor: "#e0e7ff",
  color: "#4338ca",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "bold"
};

const statusActiveStyle: React.CSSProperties = {
  color: "#059669",
  fontWeight: "600"
};

const statusInactiveStyle: React.CSSProperties = {
  color: "#dc2626",
  fontWeight: "600"
};

const deactivateButtonStyle: React.CSSProperties = {
  padding: "6px 12px",
  backgroundColor: "#fee2e2",
  color: "#dc2626",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold"
};

const deleteButtonStyle: React.CSSProperties = {
  ...deactivateButtonStyle,
  backgroundColor: "#dc2626",
  color: "#fff"
};

export default AdminDashboard;
