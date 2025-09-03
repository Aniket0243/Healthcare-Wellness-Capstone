// src/pages/Auth/ProviderRegister.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { FaUserMd } from "react-icons/fa";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  specialization: "",
  phone: "",
  role: "DOCTOR", // default
};

export default function ProviderRegister() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, Email and Password are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      specialization: form.specialization || null,
      phone: form.phone || null,
      role: form.role,
    };

    try {
      setSubmitting(true);
      await api.post("/api/providers/register", payload);
      setSuccessMsg("✅ Provider registered successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: 640, borderRadius: "20px" }}>
        <div className="text-center mb-4">
          <FaUserMd size={40} className="text-success mb-2" />
          <h2 className="fw-bold">Provider Registration</h2>
          <p className="text-muted">Join our network of doctors & wellness experts</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {successMsg && <div className="alert alert-success">{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name*</label>
            <input
              name="name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Dr. John Doe"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email*</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="doctor@example.com"
            />
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Password*</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Confirm Password*</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="mb-3 mt-3">
            <label className="form-label">Specialization</label>
            <input
              name="specialization"
              className="form-control"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Cardiologist, Yoga Trainer..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              name="phone"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="DOCTOR">Doctor</option>
              <option value="WELLNESS_PROVIDER">Wellness Provider</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 mt-2"
            disabled={submitting}
          >
            {submitting ? "Registering..." : "Create Account"}
          </button>

          <div className="text-center mt-3">
            <small className="text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Login here
              </Link>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
}
