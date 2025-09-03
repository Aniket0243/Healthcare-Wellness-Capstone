// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/main.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Payments from "./pages/Payments/Payments";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import RegisterChoice from "./pages/Auth/RegisterChoice";
import ProviderRegister from "./pages/Auth/ProviderRegister";

// Dashboards
import PatientDashboard from "./pages/Patient/Dashboard";
import ProviderDashboard from "./pages/Provider/Dashboard";
import AdminDashboard from "./pages/Admin/Dashboard";

// Wellness
import Services from "./pages/Wellness/Services";
import MyEnrollments from "./pages/Wellness/MyEnrollments";

// Appointments
import AppointmentList from "./pages/Appointments/AppointmentList";

const Home = () => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role === "ADMIN") return <Navigate to="/admin" replace />;
  if (role === "DOCTOR" || role === "WELLNESS_PROVIDER")
    return <Navigate to="/provider" replace />;
  return <Navigate to="/patient" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterChoice />} />
          <Route path="/register/patient" element={<Register />} />
          <Route path="/register/provider" element={<ProviderRegister />} />

          {/* Patient */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute roles={["PATIENT"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/appointments"
            element={
              <ProtectedRoute roles={["PATIENT"]}>
                <AppointmentList />
              </ProtectedRoute>
            }
          />

          {/* Wellness */}
          <Route path="/wellness" element={<Services />} />
          <Route
            path="/wellness/my"
            element={
              <ProtectedRoute roles={["PATIENT"]}>
                <MyEnrollments />
              </ProtectedRoute>
            }
          />

          {/* Provider */}
          <Route
            path="/provider"
            element={
              <ProtectedRoute roles={["DOCTOR", "WELLNESS_PROVIDER"]}>
                <ProviderDashboard />
              </ProtectedRoute>
            }

          />

<Route
  path="/payments"
  element={
    <ProtectedRoute roles={["PATIENT"]}>
      <Payments />
    </ProtectedRoute>
  }
/>


          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["ADMIN"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
