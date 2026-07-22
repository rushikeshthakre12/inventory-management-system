import "../styles/navbar.css";
import { FaBell, FaSearch } from "react-icons/fa";

function Navbar() {
  return (
    <div className="navbar-custom">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search products..."
        />
      </div>

      <div className="navbar-right">

        <div className="notification">
          <FaBell />
        </div>

        <div className="profile">
          <div className="avatar">A</div>

          <div>
            <h4>Admin</h4>
            <p>Administrator</p>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Navbar;