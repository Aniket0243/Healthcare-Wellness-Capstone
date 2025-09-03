// src/pages/Wellness/MyEnrollments.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { Calendar, TrendingUp } from "lucide-react";

const MyEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    api
      .get("/api/wellness/my-enrollments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("📌 Enrollments response:", res.data);
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setEnrollments(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching enrollments:", err);
      });
  }, [token]);

  const updateProgress = async (enrollmentId, newProgress) => {
    try {
      await api.put(
        `/api/wellness/progress/${enrollmentId}?progress=${newProgress}`
      );
      setEnrollments(
        enrollments.map((e) =>
          e.id === enrollmentId ? { ...e, progress: newProgress } : e
        )
      );
    } catch (err) {
      console.error("Progress update failed:", err);
      alert("Failed to update progress");
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="text-white text-center py-5 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        }}
      >
        <h1 className="display-5 fw-bold">My Wellness Programs</h1>
        <p className="lead">Track your progress and stay motivated</p>
      </div>

      {/* Enrollments Section */}
      <div className="container py-5">
        {enrollments.length === 0 ? (
          <p className="text-center text-muted fs-5">No enrollments yet.</p>
        ) : (
          <div className="row g-4">
            {enrollments.map((e) => (
              <div key={e.id} className="col-md-6 col-lg-4">
                <div className="card shadow-lg border-0 rounded-4 h-100 p-4">
                  {/* Title */}
                  <h4 className="fw-bold text-primary mb-2">
                    {e.service?.name}
                  </h4>
                  <p className="text-muted">{e.service?.description}</p>

                  {/* Dates */}
                  <div className="d-flex align-items-center mb-3">
                    <Calendar size={18} className="me-2 text-success" />
                    <small>
                      <strong>{e.startDate}</strong> → <strong>{e.endDate}</strong>
                    </small>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="fw-semibold">
                        <TrendingUp size={18} className="me-1 text-info" />
                        Progress
                      </span>
                      <span>{e.progress}%</span>
                    </div>
                    <div className="progress mt-1" style={{ height: "10px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                          width: `${e.progress}%`,
                          background:
                            e.progress < 40
                              ? "#ff7675"
                              : e.progress < 70
                              ? "#f9ca24"
                              : "#55efc4",
                        }}
                        aria-valuenow={e.progress}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                  </div>

                  {/* Progress Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={e.progress}
                    className="form-range"
                    onChange={(ev) => updateProgress(e.id, ev.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEnrollments;
