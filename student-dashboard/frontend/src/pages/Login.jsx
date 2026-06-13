import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "student@example.com", password: "123456" });
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Welcome Back 👋</h2>
        <p className="login-subtitle">Sign in to your student dashboard</p>

        {error && <p className="error">{error}</p>}

        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} />
        </div>

        <button className="login-btn" type="submit">Sign In →</button>
        <p className="demo-hint">Demo: student@example.com / 123456</p>
      </form>
    </div>
  );
}

export default Login;
