import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { getDashboardData } from "../services/dashboardService";
import "../styles/dashboard.css";


function Dashboard() {

  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalStockValue: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardData();
      setDashboard(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="cards">

          <DashboardCard
            title="Products"
            value={dashboard.totalProducts}
          />

          <DashboardCard
            title="Categories"
            value={dashboard.totalCategories}
          />

          <DashboardCard
            title="Inventory Value"
            value={`₹${dashboard.totalStockValue}`}
          />

          <DashboardCard
            title="Low Stock"
            value={dashboard.lowStockProducts}
          />

        </div>
      </div>
    </div>
  );
}

export default Dashboard;