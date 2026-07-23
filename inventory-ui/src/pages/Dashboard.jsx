import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { FiPackage, FiLayers, FiAlertTriangle, FiDollarSign } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import api from "../services/api";
import "../styles/dashboard.css";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [dashRes, prodRes, catRes] = await Promise.all([
        api.get("/dashboard"),
        api.get("/products"),
        api.get("/categories"),
      ]);

      setDashboardData(dashRes.data);

      const catData = catRes.data.map(cat => ({
        name: cat.name,
        value: prodRes.data.filter(p => p.category?.id === cat.id).length,
      }));
      setCategoryData(catData);

      const lowStock = prodRes.data.filter(p => p.quantity <= p.lowStockThreshold);
      setLowStockProducts(lowStock);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: "Total Products",
      value: dashboardData?.totalProducts || 0,
      icon: <FiPackage />,
      color: "#6366f1",
    },
    {
      title: "Categories",
      value: dashboardData?.totalCategories || 0,
      icon: <FiLayers />,
      color: "#8b5cf6",
    },
    {
  title: "Inventory Value",
  value: "₹ " + (dashboardData?.totalStockValue || 0).toLocaleString(),
  icon: (
    <span style={{ fontSize: "24px", fontWeight: 700 }}>₹</span>
  ),
  color: "#22c55e",
  },
    {
      title: "Low Stock Items",
      value: dashboardData?.lowStockProducts || 0,
      icon: <FiAlertTriangle />,
      color: "#ef4444",
    },
  ];

  return (
    <div className="dashboard-page">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="content-wrapper">
          <motion.div 
            className="page-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Real-time inventory analytics and insights</p>
          </motion.div>

          <div className="stats-grid">
            {cards.map((card, i) => (
              <DashboardCard key={i} {...card} index={i} />
            ))}
          </div>

          <div className="charts-section">
            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-card-title">Products by Category</h3>
                  <p className="chart-card-subtitle">Distribution overview</p>
                </div>
              </div>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(15, 16, 21, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "12px",
                        color: "#e2e8f0",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                    <Legend 
                      formatter={(value) => <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "40px" }}>
                  No data available
                </p>
              )}
            </motion.div>

            <motion.div 
              className="chart-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="chart-card-header">
                <div>
                  <h3 className="chart-card-title">Quick Summary</h3>
                  <p className="chart-card-subtitle">Key metrics at a glance</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "10px 0" }}>
                {[
                  { label: "Total Stock Value", value: "₹" + (dashboardData?.totalStockValue || 0).toLocaleString(), color: "#22c55e" },
                  { label: "Average per Product", value: "₹" + (dashboardData?.totalProducts > 0 ? Math.round(dashboardData.totalStockValue / dashboardData.totalProducts).toLocaleString() : 0), color: "#6366f1" },
                  { label: "Low Stock Alert", value: (dashboardData?.lowStockProducts || 0) + " items", color: "#ef4444" },
                  { label: "Categories Used", value: dashboardData?.totalCategories || 0, color: "#8b5cf6" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#9ca3af", fontSize: "14px" }}>{item.label}</span>
                    <span style={{ color: item.color, fontSize: "16px", fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {lowStockProducts.length > 0 && (
            <motion.div 
              className="low-stock-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="section-header">
                <div className="section-title">
                  <FiAlertTriangle style={{ color: "#ef4444" }} />
                  Low Stock Alerts
                  <span className="alert-badge">{lowStockProducts.length} items</span>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>SKU</th>
                      <th>Current Stock</th>
                      <th>Threshold</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.id} className="low-stock-row">
                        <td style={{ fontWeight: 500 }}>{product.name}</td>
                        <td style={{ color: "#6b7280" }}>{product.sku || "-"}</td>
                        <td>
                          <span style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#ef4444",
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: 600,
                          }}>
                            {product.quantity}
                          </span>
                        </td>
                        <td>{product.lowStockThreshold}</td>
                        <td style={{ color: "#9ca3af" }}>{product.category?.name || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;