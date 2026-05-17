import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Activity, 
  LayoutDashboard, 
  Users, 
  Plus, 
  LogOut,
  Home,
  ChevronRight,
  Sun,
  Moon
} from "lucide-react";
import { useState, useEffect } from "react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Activity size={20} />
        </div>
        <div>
          <h2>HeelWatch Pro</h2>
          <p>Pressure Monitoring</p>
        </div>
      </div>

      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link 
          to="/patients" 
          className={`nav-item ${location.pathname === "/patients" ? "active" : ""}`}
        >
          <Users size={20} />
          <span>Patients</span>
        </Link>
      </div>

      <div className="sidebar-footer">
        <button className="nav-item" onClick={handleLogout} style={{ background: "transparent", border: "none", width: "100%", textAlign: "left", fontFamily: "inherit" }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const getBreadcrumbs = () => {
    if (location.pathname === "/dashboard") return "Dashboard / Assessment";
    if (location.pathname === "/monitoring") return "Dashboard / Monitor Risk";
    if (location.pathname === "/patients") return "Dashboard / Patients Directory";
    return "Dashboard";
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div className="breadcrumb">
            <Home size={14} />
            {getBreadcrumbs().split(" / ").map((crumb, idx, arr) => (
              <span key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {idx > 0 && <ChevronRight size={14} />}
                <span style={{ color: idx === arr.length - 1 ? "#e5e7eb" : "inherit" }}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
          <div className="user-profile">
            <button className="btn-icon" onClick={() => setIsDarkMode(!isDarkMode)} style={{ border: "none" }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
