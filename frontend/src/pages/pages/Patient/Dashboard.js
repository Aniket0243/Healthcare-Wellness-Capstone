// src/pages/PatientDashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, CreditCard, Heart, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const wellnessQuotes = [
  "Health is the greatest wealth.",
  "A fit body, a calm mind, a house full of love.",
  "Take care of your body. It’s the only place you have to live.",
  "Wellness is the natural state of my body.",
  "Self-care is how you take your power back.",
];

const Dashboard = () => {
  const { user, role } = useAuth();

  // pick a random quote for variety
  const randomQuote =
    wellnessQuotes[Math.floor(Math.random() * wellnessQuotes.length)];

  return (
    <div>
      {/* Hospital Identity */}
      <div className="bg-light py-4 border-bottom text-center">
        <img
          src="/image.png"
          alt="Hospital Logo"
          style={{ height: "80px", objectFit: "contain" }}
        />
        <h2 className="fw-bold mt-3">🌿 Bharat HealthCare and Wellness</h2>
        <p className="text-muted">
          Dedicated to holistic wellness, compassionate care, and modern
          healthcare services.
        </p>
      </div>

      {/* Hero Section */}
      <div
        className="text-white text-center py-5 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        }}
      >
        <h1 className="display-5 fw-bold">
          {user?.name ? `Welcome, ${user.name}!` : "Welcome to Your Dashboard"}
        </h1>
        <p className="lead mb-0">
          {role === "PATIENT" &&
            "Manage your appointments, payments, and wellness services with ease."}
          {role === "DOCTOR" &&
            "View your patients, manage appointments, and track wellness progress."}
          {role === "ADMIN" &&
            "Oversee users, appointments, and payments from one place."}
        </p>
      </div>

      {/* Wellness Quote */}
      <div className="container text-center my-4">
        <blockquote className="blockquote fst-italic text-primary">
          “{randomQuote}”
        </blockquote>
      </div>

      {/* Quick Actions */}
      <div className="container py-5">
        <h3 className="mb-4 text-center">Quick Actions</h3>
        <div className="row g-4">
          {/* Appointments */}
          <div className="col-md-4">
            <Link to="/appointments" className="text-decoration-none text-dark">
              <div className="card shadow-sm h-100 text-center p-4 border-0 rounded-3 hover-shadow">
                <CalendarCheck size={40} className="mb-3 text-primary" />
                <h5>Appointments</h5>
                <p>Book and manage your doctor appointments.</p>
              </div>
            </Link>
          </div>

          {/* Payments */}
          <div className="col-md-4">
            <Link to="/payments" className="text-decoration-none text-dark">
              <div className="card shadow-sm h-100 text-center p-4 border-0 rounded-3 hover-shadow">
                <CreditCard size={40} className="mb-3 text-success" />
                <h5>Payments</h5>
                <p>Pay bills and view your past transactions.</p>
              </div>
            </Link>
          </div>

          {/* Wellness Services */}
          <div className="col-md-4">
            <Link to="/wellness" className="text-decoration-none text-dark">
              <div className="card shadow-sm h-100 text-center p-4 border-0 rounded-3 hover-shadow">
                <Heart size={40} className="mb-3 text-danger" />
                <h5>Wellness</h5>
                <p>Explore and enroll in wellness programs.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Quote / Motto */}
      <div className="bg-light text-center py-4 border-top mt-5">
        <Building2 size={24} className="text-secondary mb-2" />
        <p className="mb-0 text-muted">
          Bharat HealthCare and Wellness — “Caring for life, every step of the way.”
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
