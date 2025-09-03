// src/pages/Payments/Payments.js
import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { jsPDF } from "jspdf";

const Payments = () => {
  const { token, role } = useAuth();
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    appointmentId: null,
    serviceId: null,
    status: "SUCCESS",
  });

  useEffect(() => {
    if (role === "PATIENT") {
      api.get("/api/payments/my", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setPayments(res.data || []))
        .catch(() => setPayments([]));

      api.get("/api/appointments/my", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setAppointments(res.data || []))
        .catch(() => setAppointments([]));

      api.get("/api/wellness/services")
        .then((res) => setServices(res.data || []))
        .catch(() => setServices([]));
    }

    if (role === "ADMIN") {
      api.get("/api/payments/all", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setPayments(res.data || []))
        .catch(() => setPayments([]));
    }
  }, [role, token]);

  const handlePayment = async (e) => {
    e.preventDefault();

    const appointmentId = form.appointmentId ? Number(form.appointmentId) : null;
    const serviceId = form.serviceId ? Number(form.serviceId) : null;

    if (!appointmentId && !serviceId) {
      alert("Please select at least an Appointment or a Service.");
      return;
    }

    const payload = { status: form.status };
    if (appointmentId) payload.appointmentId = appointmentId;
    if (serviceId) payload.serviceId = serviceId;

    try {
      const { data } = await api.post("/api/payments", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPayments((prev) => [...prev, data]);
      setForm({ appointmentId: null, serviceId: null, status: "SUCCESS" });
    } catch (err) {
      alert(err?.response?.data || "Payment failed");
    }
  };

  const handleDownloadReceipt = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("🏥 Bharat HealthCare Clinic - Receipt", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Payment ID: ${payment.id}`, 20, 40);
    doc.text(`Status: ${payment.paymentStatus}`, 20, 50);
    doc.text(`Date: ${payment.paymentDate || new Date().toLocaleDateString()}`, 20, 60);
    doc.text(`Transaction: ${payment.transactionId || "N/A"}`, 20, 70);
    doc.text(`Appointment: ${payment.appointment?.provider?.name || "-"}`, 20, 80);
    doc.text(`Service: ${payment.service?.name || "-"}`, 20, 90);
    doc.text("Thank you for your payment!", 20, 110);
    doc.save(`payment_${payment.id}.pdf`);
  };

  const getStatusBadge = (status) => {
    const colors = {
      SUCCESS: "badge bg-success",
      PENDING: "badge bg-warning text-dark",
      FAILED: "badge bg-danger",
    };
    return <span className={colors[status] || "badge bg-secondary"}>{status}</span>;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Payments</h2>

      {role === "PATIENT" && (
        <div className="card p-3 mb-4 shadow-sm">
          <h5 className="mb-3">💳 Make a Payment</h5>
          <form onSubmit={handlePayment}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Appointment</label>
                <select
                  className="form-select"
                  value={form.appointmentId ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, appointmentId: e.target.value || null })
                  }
                >
                  <option value="">-- Select Appointment --</option>
                  {appointments.map((a) => (
                    <option key={a.id} value={a.id}>
                      Dr. {a.provider?.name || "Unknown"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  value={form.serviceId ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, serviceId: e.target.value || null })
                  }
                >
                  <option value="">-- Select Service --</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="PENDING">PENDING</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary mt-3">
              Pay Now
            </button>
          </form>
        </div>
      )}

      <h5 className="mb-3">{role === "PATIENT" ? "My Payments" : "All Payments"}</h5>
      <div className="row">
        {payments.map((p) => (
          <div key={p.id} className="col-md-6 mb-3">
            <div className="card shadow-sm p-3">
              <div className="d-flex justify-content-between">
                <h6>Payment #{p.id}</h6>
                {getStatusBadge(p.paymentStatus)}
              </div>
              <p className="mb-1"><strong>Date:</strong> {new Date(p.paymentDate).toLocaleDateString()}</p>
              <p className="mb-1"><strong>Transaction:</strong> {p.transactionId || "N/A"}</p>
              <p className="mb-1"><strong>Appointment:</strong> {p.appointment ? `Dr. ${p.appointment.provider?.name}` : "-"}</p>
              <p className="mb-1"><strong>Service:</strong> {p.service ? p.service.name : "-"}</p>
              <button
                className="btn btn-outline-success btn-sm mt-2"
                onClick={() => handleDownloadReceipt(p)}
              >
                Download Receipt
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Payments;
