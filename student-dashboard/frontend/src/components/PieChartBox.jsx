import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Modal from "./Modal";

const COLORS = ["#a78bfa", "#34d399", "#f472b6", "#60a5fa", "#fb923c"];

function PieChartBox({ data }) {
  const [open, setOpen] = useState(false);

  if (!data || data.length === 0)
    return <div className="chart-card"><h3>🎯 Course Distribution</h3><p>No course data available.</p></div>;

  const chartData = data.map((item) => ({
    name: item.course?.title || "Unknown",
    value: item.completedCount || 0,
    timeSpent: item.totalTimeSpent || 0,
  }));

  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <div className="chart-card chart-card-clickable" onClick={() => setOpen(true)}>
        <h3>🎯 Course Distribution <span className="chart-expand-hint">Click to expand</span></h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={100} innerRadius={40} paddingAngle={3} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, color: "#fff" }} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {open && (
        <Modal title="🎯 Course Distribution Details" onClose={() => setOpen(false)}>
          <p className="modal-subtitle">Breakdown of completed lessons per course</p>
          <div className="modal-course-list">
            {chartData.map((item, i) => {
              const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
              return (
                <div key={i} className="modal-course-row">
                  <div className="modal-course-dot" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="modal-course-info">
                    <div className="modal-course-name">{item.name}</div>
                    <div className="modal-progress-bar">
                      <div className="modal-progress-fill" style={{ width: `${pct}%`, background: COLORS[i % COLORS.length] }} />
                    </div>
                    <div className="modal-course-stats">
                      <span>✅ {item.value} lessons completed</span>
                      <span>⏱️ {item.timeSpent} mins</span>
                      <span>📊 {pct}% of total</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="modal-summary-row">
            <span>Total lessons completed: <strong>{total}</strong></span>
          </div>
        </Modal>
      )}
    </>
  );
}

export default PieChartBox;
