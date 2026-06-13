import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import Modal from "./Modal";

function TrendChart({ data }) {
  const [open, setOpen] = useState(false);

  if (!data || data.length === 0)
    return <div className="chart-card"><h3>📈 Learning Time Trend</h3><p>No trend data available.</p></div>;

  const formatted = data.map((item) => ({
    date: item._id,
    timeSpent: item.timeSpent,
    completedLessons: item.completedLessons,
  }));

  const totalTime = formatted.reduce((s, d) => s + d.timeSpent, 0);
  const totalLessons = formatted.reduce((s, d) => s + d.completedLessons, 0);
  const avgTime = formatted.length ? (totalTime / formatted.length).toFixed(1) : 0;
  const peakDay = formatted.reduce((a, b) => (b.timeSpent > a.timeSpent ? b : a), formatted[0]);

  return (
    <>
      <div className="chart-card chart-card-clickable" onClick={() => setOpen(true)}>
        <h3>📈 Learning Time Trend <span className="chart-expand-hint">Click to expand</span></h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} />
            <Tooltip contentStyle={{ background: "#1e1b4b", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 10, color: "#fff" }} />
            <Legend wrapperStyle={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }} />
            <Line type="monotone" dataKey="timeSpent" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: "#a78bfa" }} name="Time Spent" />
            <Line type="monotone" dataKey="completedLessons" stroke="#34d399" strokeWidth={2.5} dot={{ fill: "#34d399" }} name="Lessons Done" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {open && (
        <Modal title="📈 Learning Trend Details" onClose={() => setOpen(false)}>
          <div className="modal-stat-grid">
            <div className="modal-stat-item">
              <div className="modal-stat-label">⏱️ Total Time</div>
              <div className="modal-stat-value">{totalTime} mins</div>
            </div>
            <div className="modal-stat-item">
              <div className="modal-stat-label">✅ Total Lessons</div>
              <div className="modal-stat-value">{totalLessons}</div>
            </div>
            <div className="modal-stat-item">
              <div className="modal-stat-label">📊 Avg/Day</div>
              <div className="modal-stat-value">{avgTime} mins</div>
            </div>
            <div className="modal-stat-item">
              <div className="modal-stat-label">🔥 Peak Day</div>
              <div className="modal-stat-value">{peakDay?.date}</div>
            </div>
          </div>
          <table className="modal-table">
            <thead>
              <tr><th>Date</th><th>Time Spent</th><th>Lessons Done</th></tr>
            </thead>
            <tbody>
              {formatted.map((row, i) => (
                <tr key={i} className={row.date === peakDay?.date ? "modal-table-peak" : ""}>
                  <td>{row.date}</td>
                  <td>{row.timeSpent} mins</td>
                  <td>{row.completedLessons}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>
      )}
    </>
  );
}

export default TrendChart;
