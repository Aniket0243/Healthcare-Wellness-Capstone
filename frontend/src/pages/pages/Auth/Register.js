// src/pages/Auth/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { FaUserPlus } from "react-icons/fa";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  address: "",
  dob: "",
  gender: "Male",
};

export default function Register() {
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
      phone: form.phone || null,
      address: form.address || null,
      dob: form.dob || null,
      gender: form.gender || null,
    };

    try {
      setSubmitting(true);
      await api.post("/api/patients/register", payload);
      setSuccessMsg("🎉 Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed. Please check your details.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4"
        style={{ width: "100%", maxWidth: 640, borderRadius: "20px" }}
      >
        <div className="text-center mb-4">
          <FaUserPlus size={40} className="text-primary mb-2" />
          <h2 className="fw-bold">Patient Registration</h2>
          <p className="text-muted">Create your account to access healthcare services</p>
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
              placeholder="John Doe"
              required
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
              placeholder="john@example.com"
              required
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
                placeholder="••••••••"
                required
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
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <input
                name="phone"
                className="form-control"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="form-control"
                value={form.dob}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row g-3 mt-2">
            <div className="col-md-8">
              <label className="form-label">Address</label>
              <input
                name="address"
                className="form-control"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, City"
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={form.gender}
                onChange={handleChange}
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 mt-3"
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
