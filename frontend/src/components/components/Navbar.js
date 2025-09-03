// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, role, email, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 shadow-sm">
      {/* Brand */}
      <Link className="navbar-brand fw-bold" to="/">
        <span role="img" aria-label="health">🌿</span> Health & Wellness
      </Link>

      {/* Mobile Toggle */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#nav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* Links */}
      <div id="nav" className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {/* Public */}
          <li className="nav-item">
            <Link className="nav-link" to="/wellness">Wellness</Link>
          </li>

          {/* Patient-only */}
          {role === "PATIENT" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/appointments">Appointments</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/patient">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/payments">Payments</Link>
              </li>
            </>
          )}

          {/* Provider */}
          {(role === "DOCTOR" || role === "WELLNESS_PROVIDER") && (
            <li className="nav-item">
              <Link className="nav-link" to="/provider">Provider</Link>
            </li>
          )}

          {/* Admin */}
          {role === "ADMIN" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">Admin</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/services">Services</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/payments">Payments</Link>
              </li>
            </>
          )}
        </ul>

        {/* Right Side */}
        <ul className="navbar-nav ms-auto align-items-center">
          {!user ? (
            <>
              <li className="nav-item me-2">
                <Link className="btn btn-outline-light btn-sm" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-success btn-sm" to="/register">
                  Register
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item me-3 text-white small">
                {email}{" "}
                <span className="badge bg-secondary ms-2 text-uppercase">
                  {role}
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-warning btn-sm" onClick={logout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
