import { useLocation } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import "../styles/navbar.css";

const Navbar = () => {
  const location = useLocation();
  
  // Get current page name from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path === "/products") return "Products";
    if (path === "/categories") return "Categories";
    return "Inventory Management";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        <div className="navbar-user">
          <div className="user-avatar">
            <FiUser size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;