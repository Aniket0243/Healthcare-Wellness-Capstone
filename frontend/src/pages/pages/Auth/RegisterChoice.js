// src/pages/Auth/RegisterChoice.js
import React from "react";
import { Link } from "react-router-dom";
import { FaUserInjured, FaUserMd } from "react-icons/fa";

export default function RegisterChoice() {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: 600, borderRadius: "20px" }}>
        <h3 className="mb-4 text-center">✨ Join Our HealthCare Platform</h3>
        <p className="text-center text-muted mb-4">
          Select how you’d like to register and start your journey with us.
        </p>

        <div className="row g-4">
          {/* Patient Card */}
          <div className="col-md-6">
            <Link
              to="/register/patient"
              className="text-decoration-none"
            >
              <div className="card h-100 text-center shadow-sm p-3 border-0 hover-card">
                <FaUserInjured size={50} className="text-primary mb-3" />
                <h5 className="mb-2">Register as Patient</h5>
                <p className="text-muted small">
                  Book appointments, access wellness services, and manage your health online.
                </p>
                <button className="btn btn-primary mt-auto">Get Started</button>
              </div>
            </Link>
          </div>

          {/* Provider Card */}
          <div className="col-md-6">
            <Link
              to="/register/provider"
              className="text-decoration-none"
            >
              <div className="card h-100 text-center shadow-sm p-3 border-0 hover-card">
                <FaUserMd size={50} className="text-success mb-3" />
                <h5 className="mb-2">Register as Provider</h5>
                <p className="text-muted small">
                  Offer medical consultations, manage appointments, and grow your practice.
                </p>
                <button className="btn btn-success mt-auto">Get Started</button>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Extra CSS for hover effect */}
      <style>
        {`
          .hover-card {
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }
          .hover-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
}
