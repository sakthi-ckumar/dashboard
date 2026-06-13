function ProgressCard({ title, value, icon, colorClass, onClick }) {
  return (
    <div className={`progress-card ${colorClass}`} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <div className="card-glow" />
      <div className="card-icon">{icon}</div>
      <h3>{title}</h3>
      <div className="card-value">{value}</div>
      {onClick && <div className="card-hint">Click for details →</div>}
    </div>
  );
}

export default ProgressCard;
