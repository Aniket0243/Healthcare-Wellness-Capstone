// src/pages/Appointments/AppointmentList.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { CalendarDays, User, ClipboardList, XCircle, Clock, Check } from "lucide-react";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [newAppt, setNewAppt] = useState({
    providerId: "",
    appointmentDate: "",
    notes: "",
  });
  const [rescheduleId, setRescheduleId] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState("");

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await api.get("/api/appointments/my");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    }
  };

  // Fetch providers
  const fetchProviders = async () => {
    try {
      const res = await api.get("/api/providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Error fetching providers", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchProviders();
  }, []);

  // Book appointment
  const handleBook = async () => {
    try {
      const payload = {
        provider: { id: newAppt.providerId },
        appointmentDate: newAppt.appointmentDate,
        status: "SCHEDULED",
        notes: newAppt.notes,
      };
      await api.post("/api/appointments", payload);
      setNewAppt({ providerId: "", appointmentDate: "", notes: "" });
      fetchAppointments();
    } catch (err) {
      console.error("Error booking appointment", err);
    }
  };

  // Cancel appointment
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?"))
      return;
    try {
      await api.delete(`/api/appointments/${id}/cancel`);
      fetchAppointments();
    } catch (err) {
      console.error("Error canceling appointment", err);
    }
  };

  // Reschedule appointment
  const handleReschedule = async (id) => {
    try {
      const payload = {
        appointmentDate: rescheduleDate,
        notes: "Rescheduled by patient",
      };
      await api.put(`/api/appointments/${id}/reschedule`, payload);
      setRescheduleId(null);
      setRescheduleDate("");
      fetchAppointments();
    } catch (err) {
      console.error("Error rescheduling appointment", err);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <div
        className="text-white text-center py-5 shadow-sm"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <h1 className="display-5 fw-bold">My Appointments</h1>
        <p className="lead">Manage and track your healthcare visits</p>
      </div>

      <div className="container py-5">
        {/* Appointment Booking Form */}
        <div className="card shadow-lg border-0 rounded-4 mb-5 p-4">
          <h4 className="fw-bold mb-3">📅 Book New Appointment</h4>

          <select
            value={newAppt.providerId}
            onChange={(e) => setNewAppt({ ...newAppt, providerId: e.target.value })}
            className="form-select mb-3"
          >
            <option value="">-- Select Provider --</option>
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.specialty})
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={newAppt.appointmentDate}
            onChange={(e) => setNewAppt({ ...newAppt, appointmentDate: e.target.value })}
            className="form-control mb-3"
          />

          <textarea
            placeholder="Notes"
            value={newAppt.notes}
            onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
            className="form-control mb-3"
          />

          <button className="btn btn-primary w-100 fw-semibold" onClick={handleBook}>
            Book Appointment
          </button>
        </div>

        {/* Appointment List */}
        <div className="row g-4">
          {appointments.length === 0 ? (
            <p className="text-muted text-center">No appointments found.</p>
          ) : (
            appointments.map((appt) => (
              <div key={appt.id} className="col-md-6 col-lg-4">
                <div className="card shadow-sm border-0 rounded-4 h-100 p-4">
                  <h5 className="fw-bold text-primary mb-2">
                    <CalendarDays size={18} className="me-2" />
                    {new Date(appt.appointmentDate).toLocaleString()}
                  </h5>

                  <p className="mb-1">
                    <User size={16} className="me-2 text-secondary" />
                    <strong>Provider:</strong> {appt.provider?.name} ({appt.provider?.specialty})
                  </p>

                  <p className="mb-1">
                    <ClipboardList size={16} className="me-2 text-secondary" />
                    <strong>Status:</strong>{" "}
                    <span
                      className={`badge ${
                        appt.status === "SCHEDULED"
                          ? "bg-info"
                          : appt.status === "CANCELED"
                          ? "bg-danger"
                          : "bg-success"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </p>

                  {appt.notes && (
                    <p className="text-muted">
                      📝 <em>{appt.notes}</em>
                    </p>
                  )}

                  {/* Actions */}
                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    <button
                      className="btn btn-danger btn-sm d-flex align-items-center"
                      onClick={() => handleCancel(appt.id)}
                    >
                      <XCircle size={16} className="me-1" /> Cancel
                    </button>

                    {rescheduleId === appt.id ? (
                      <div className="w-100">
                        <input
                          type="datetime-local"
                          value={rescheduleDate}
                          onChange={(e) => setRescheduleDate(e.target.value)}
                          className="form-control mb-2"
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-success btn-sm d-flex align-items-center"
                            onClick={() => handleReschedule(appt.id)}
                          >
                            <Check size={16} className="me-1" /> Save
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setRescheduleId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-warning btn-sm d-flex align-items-center"
                        onClick={() => setRescheduleId(appt.id)}
                      >
                        <Clock size={16} className="me-1" /> Reschedule
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
