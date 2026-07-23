import { motion } from "framer-motion";
import "../styles/dashboardCard.css";

const DashboardCard = ({ title, value, icon, color, index = 0 }) => {
  return (
    <motion.div
      className="dashboard-card"
      style={{ "--card-color": color }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
    >
      <div className="card-glow" style={{ background: color }}></div>
      <div className="card-content">
        <div className="card-info">
          <p className="card-label">{title}</p>
          <h3 className="card-value">{value}</h3>
        </div>
        <div 
          className="card-icon-wrapper"
          style={{ background: `${color}15`, color: color }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardCard;