import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  FiGrid, FiBox, FiLayers, FiLogOut, FiMenu, FiX, FiChevronLeft 
} from "react-icons/fi";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setMobileOpen(true)}
      >
        <FiMenu size={22} />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}>
        {/* Mobile Close */}
        <button 
          className="mobile-close-btn"
          onClick={() => setMobileOpen(false)}
        >
          <FiX size={22} />
        </button>

        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            {!collapsed ? (
              <>
                <h2>BeRAM Drones</h2>
                <span className="sidebar-subtitle">Inventory</span>
              </>
            ) : (
              <h2 className="collapsed-logo">B</h2>
            )}
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setCollapsed(!collapsed)}
          >
            <FiChevronLeft className={`collapse-icon ${collapsed ? "rotated" : ""}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <span className="nav-section-title">Menu</span>
          
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={() => setMobileOpen(false)}
          >
            <FiGrid className="nav-icon" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink 
            to="/products" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={() => setMobileOpen(false)}
          >
            <FiBox className="nav-icon" />
            {!collapsed && <span>Products</span>}
          </NavLink>

          <NavLink 
            to="/categories" 
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={() => setMobileOpen(false)}
          >
            <FiLayers className="nav-icon" />
            {!collapsed && <span>Categories</span>}
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut className="nav-icon" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;