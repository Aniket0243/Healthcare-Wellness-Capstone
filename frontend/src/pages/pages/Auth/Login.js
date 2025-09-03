// src/pages/Auth/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaUserLock } from "react-icons/fa";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form.email, form.password);
    if (!res.ok) {
      setError(res.message || "Login failed");
      return;
    }
    // ✅ Route by role
    const role = res.role;
    if (role === "ADMIN") navigate("/admin");
    else if (role === "DOCTOR" || role === "WELLNESS_PROVIDER") navigate("/provider");
    else navigate("/patient");
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: 420, borderRadius: "20px" }}>
        <div className="text-center mb-4">
          <FaUserLock size={40} className="text-primary mb-2" />
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted">Please sign in to continue</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="text-center">
          <small className="text-muted">
            Don’t have an account?{" "}
            <Link to="/register-choice" className="text-decoration-none">
              Create one
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
