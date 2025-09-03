// src/pages/Provider/ProviderDashboard.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { FaUserMd, FaCalendarCheck } from "react-icons/fa";

export default function ProviderDashboard() {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/providers/me");
      setProfile(res.data);
    } catch (err) {
      console.error("Error fetching provider profile", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments/provider/my");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <FaUserMd size={40} className="text-success mb-2" />
        <h2 className="fw-bold">Provider Dashboard</h2>
        <p className="text-muted">Manage your profile and patient appointments</p>
      </div>

      {/* Profile Section */}
      {profile && (
        <div className="card shadow-sm mb-5 p-4 rounded-4">
          <h4 className="fw-bold mb-3">👨‍⚕️ My Profile</h4>
          <div className="row g-3">
            <div className="col-md-6">
              <p><strong>Name:</strong> {profile.name}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone || "N/A"}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Specialization:</strong> {profile.specialization || "N/A"}</p>
              <p><strong>Role:</strong> {profile.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Appointments Section */}
      <div className="card shadow-sm p-4 rounded-4">
        <div className="d-flex align-items-center mb-3">
          <FaCalendarCheck className="text-primary me-2" />
          <h4 className="fw-bold mb-0">My Appointments</h4>
        </div>

        {appointments.length === 0 ? (
          <p className="text-muted">No appointments yet.</p>
        ) : (
          <div className="list-group">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="list-group-item list-group-item-action mb-3 rounded shadow-sm"
              >
                <p className="mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(appt.appointmentDate).toLocaleString()}
                </p>
                <p className="mb-1">
                  <strong>Patient:</strong> {appt.patient?.name}
                </p>
                <p className="mb-1">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      appt.status === "CONFIRMED"
                        ? "bg-success"
                        : appt.status === "PENDING"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {appt.status}
                  </span>
                </p>
                {appt.notes && (
                  <p className="text-muted small mb-0">📝 {appt.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
