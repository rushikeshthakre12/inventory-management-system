import { FaBoxOpen, FaThLarge, FaTags, FaSignOutAlt } from "react-icons/fa";
import "../styles/sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>🚁 BeRAM</h2>

      <ul>
        <li>
          <FaThLarge />
          <span>Dashboard</span>
        </li>

        <li>
          <FaBoxOpen />
          <span>Products</span>
        </li>

        <li>
          <FaTags />
          <span>Categories</span>
        </li>

        <li>
          <FaSignOutAlt />
          <span>Logout</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;