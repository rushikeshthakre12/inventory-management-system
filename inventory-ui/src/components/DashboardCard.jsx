import "../styles/dashboardCard.css";

function DashboardCard({ title, value }) {
  return (
    <div className="dashboard-card">
      <h5>{title}</h5>
      <h2>{value}</h2>
    </div>
  );
}

export default DashboardCard;