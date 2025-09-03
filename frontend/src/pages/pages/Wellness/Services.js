// src/pages/Wellness/Services.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Activity, Heart, Brain, Dumbbell } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [err, setErr] = useState("");
  const { token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/api/wellness/services")
      .then(({ data }) => setServices(data || []))
      .catch(() => setErr("Failed to load services"));
  }, []);

  const handleEnroll = async (serviceId) => {
    try {
      await api.post(
        `/api/wellness/enroll/${serviceId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Enrolled successfully!");
      navigate("/wellness/my");
    } catch (err) {
      console.error("Enrollment failed:", err);
      alert("❌ Enrollment failed");
    }
  };

  // Icons for different services
  const iconMap = {
    yoga: <Activity size={40} className="text-purple-600 mb-3" />,
    mindfulness: <Brain size={40} className="text-blue-600 mb-3" />,
    cardio: <Heart size={40} className="text-red-500 mb-3" />,
    strength: <Dumbbell size={40} className="text-green-600 mb-3" />,
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="text-white text-center py-5 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <h1 className="display-5 fw-bold">Wellness Services</h1>
        <p className="lead">
          Explore and enroll in programs designed to improve your health.
        </p>
      </div>

      {/* Services Grid */}
      <div className="container py-5">
        {err && <div className="alert alert-danger">{err}</div>}
        <div className="row g-4">
          {services.map((s) => {
            const iconKey = Object.keys(iconMap).find((key) =>
              s.name.toLowerCase().includes(key)
            );
            return (
              <div key={s.id} className="col-md-6 col-lg-4">
                <div
                  className="card h-100 shadow-lg border-0 rounded-4 text-center p-4"
                  style={{
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-8px)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  {/* Icon */}
                  {iconMap[iconKey] || (
                    <Activity size={40} className="text-primary mb-3" />
                  )}

                  {/* Title */}
                  <h4 className="fw-bold">{s.name}</h4>
                  <p className="text-muted">{s.description}</p>

                  {/* Details */}
                  <p>
                    <strong>Duration:</strong> {s.duration} days
                  </p>
                  <p>
                    <strong>Fee:</strong> ₹{Number(s.fee).toFixed(2)}
                  </p>

                  {/* Enroll Button */}
                  {role === "PATIENT" && (
                    <button
                      className="btn btn-gradient mt-2 px-4 py-2 rounded-pill"
                      onClick={() => handleEnroll(s.id)}
                    >
                      Enroll
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {services.length === 0 && !err && (
          <p className="mt-3 text-center text-muted">
            No services available right now.
          </p>
        )}
      </div>

      {/* Gradient Button Styling */}
      <style>{`
        .btn-gradient {
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          border: none;
          color: white;
          font-weight: bold;
        }
        .btn-gradient:hover {
          background: linear-gradient(45deg, #43e97b, #38f9d7);
        }
      `}</style>
    </div>
  );
};

export default Services;
