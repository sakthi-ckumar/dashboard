import { useEffect, useState } from "react";
import api from "../api";
import ProgressCard from "../components/ProgressCard";
import TrendChart from "../components/TrendChart";
import PieChartBox from "../components/PieChartBox";
import Modal from "../components/Modal";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeModal, setActiveModal] = useState(null); // 'lessons' | 'time' | 'courses'

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const exportToCSV = () => {
    const rows = [
      ["Section", "Metric", "Value"],
      ["Summary", "Completed Lessons", summary?.completedLessons || 0],
      ["Summary", "Total Time Spent (mins)", summary?.totalTimeSpent || 0],
      ["Summary", "Active Courses", summary?.courseProgress?.length || 0],
      [],
      ["Course Progress", "Course", "Completed Lessons"],
      ...(summary?.courseProgress || []).map((c) => ["", c.course?.title || "Unknown", c.completedCount || 0]),
      [],
      ["Learning Trend", "Date", "Time Spent (mins)", "Completed Lessons"],
      ...trend.map((t) => ["", t._id, t.timeSpent, t.completedLessons]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `student_dashboard_${user?.name || "report"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    (async () => {
      try {
        const [summaryRes, trendRes, recRes, lessonsRes] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/trend"),
          api.get("/dashboard/recommendations"),
          api.get("/dashboard/lessons"),
        ]);
        setSummary(summaryRes.data);
        setTrend(trendRes.data);
        setRecommendation(recRes.data.recommendation);
        setLessons(lessonsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Dashboard fetch failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return (
    <div className="center">
      <div className="loading-spinner" />
      <p>Loading your dashboard…</p>
    </div>
  );

  if (error) return <div className="center"><p className="error">{error}</p></div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>📊 Student Dashboard</h1>
          <p>Welcome back, <span>{user?.name || "Student"}</span> 🎓</p>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="export-btn" onClick={exportToCSV}>⬇️ Export CSV</button>
          <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = "/"; }}>Logout</button>
        </div>
      </div>

      <div className="cards">
        <ProgressCard title="Completed Lessons" value={summary?.completedLessons || 0} icon="✅" colorClass="card-lessons" onClick={() => setActiveModal("lessons")} />
        <ProgressCard title="Total Time Spent" value={`${summary?.totalTimeSpent || 0} mins`} icon="⏱️" colorClass="card-time" onClick={() => setActiveModal("time")} />
        <ProgressCard title="Courses Active" value={summary?.courseProgress?.length || 0} icon="📚" colorClass="card-courses" onClick={() => setActiveModal("courses")} />
      </div>

      {activeModal === "lessons" && (
        <Modal title="✅ Completed Lessons" onClose={() => setActiveModal(null)}>
          <p className="modal-subtitle">{summary?.completedLessons || 0} lessons completed across all courses</p>
          <table className="modal-table">
            <thead><tr><th>Lesson</th><th>Course</th><th>Duration</th></tr></thead>
            <tbody>
              {lessons
                .filter((l) => summary?.courseProgress?.some((cp) => cp._id?.toString() === l.courseId?._id?.toString()))
                .map((l, i) => (
                  <tr key={i}>
                    <td>{l.title}</td>
                    <td>{l.courseId?.title || "Unknown"}</td>
                    <td>{l.durationMinutes} mins</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Modal>
      )}

      {activeModal === "time" && (
        <Modal title="⏱️ Time Spent Breakdown" onClose={() => setActiveModal(null)}>
          <p className="modal-subtitle">Total: <strong>{summary?.totalTimeSpent || 0} mins</strong> across all courses</p>
          <div className="modal-course-list">
            {(summary?.courseProgress || []).map((cp, i) => {
              const pct = summary?.totalTimeSpent > 0 ? ((cp.totalTimeSpent / summary.totalTimeSpent) * 100).toFixed(1) : 0;
              return (
                <div key={i} className="modal-course-row">
                  <div className="modal-course-info">
                    <div className="modal-course-name">{cp.course?.title || "Unknown"}</div>
                    <div className="modal-progress-bar">
                      <div className="modal-progress-fill" style={{ width: `${pct}%`, background: "#a78bfa" }} />
                    </div>
                    <div className="modal-course-stats">
                      <span>⏱️ {cp.totalTimeSpent} mins</span>
                      <span>📊 {pct}% of total</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}

      {activeModal === "courses" && (
        <Modal title="📚 Active Courses" onClose={() => setActiveModal(null)}>
          <p className="modal-subtitle">{summary?.courseProgress?.length || 0} courses in progress</p>
          <div className="modal-course-list">
            {(summary?.courseProgress || []).map((cp, i) => (
              <div key={i} className="modal-course-row">
                <div className="modal-course-info">
                  <div className="modal-course-name">📖 {cp.course?.title || "Unknown"}</div>
                  <div className="modal-course-stats">
                    <span>✅ {cp.completedCount} lessons done</span>
                    <span>⏱️ {cp.totalTimeSpent} mins spent</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      <div className="charts">
        <TrendChart data={trend} />
        <PieChartBox data={summary?.courseProgress || []} />
      </div>

      <div className="recommendation-box">
        <h3>💡 Adaptive Recommendation</h3>
        <p>{recommendation}</p>
      </div>
    </div>
  );
}

export default Dashboard;
