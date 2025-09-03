import React, { useState } from "react";
import api from "../../api/axiosConfig";

export default function ProviderRegister() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialization: "",
    role: "DOCTOR", // default
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/providers/register", form);
      setMessage("✅ Registered successfully! Please log in.");
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        specialization: "",
        role: "DOCTOR",
      });
    } catch (err) {
      console.error("Error registering provider", err);
      setMessage("❌ Error registering provider.");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Provider Registration</h2>
      {message && <p className="mb-3">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          placeholder="Specialization"
          className="border p-2 rounded w-full"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="DOCTOR">Doctor</option>
          <option value="WELLNESS_PROVIDER">Wellness Provider</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
