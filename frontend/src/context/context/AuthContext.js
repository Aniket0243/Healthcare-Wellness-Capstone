// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

function decodeJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload || {};
  } catch {
    return {};
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("jwt"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => {
    if (!token || !role) return null;
    return { token, role, email };
  }, [token, role, email]);

  const login = async (emailInput, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email: emailInput,
        password,
      });
      const tok = data?.token;
      if (!tok) throw new Error("No token returned");

      const payload = decodeJwt(tok);
console.log("Decoded JWT:", payload);

const r = payload?.role || payload?.roles?.[0];
if (!r) throw new Error("Token missing role");

      // Persist
      localStorage.setItem("jwt", tok);
      localStorage.setItem("role", r);
      localStorage.setItem("email", emailInput);

      setToken(tok);
      setRole(r);
      setEmail(emailInput);

      return { ok: true, role: r };
    } catch (e) {
      return { ok: false, message: e?.response?.data?.message || "Invalid credentials or server error." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  useEffect(() => {
    // Optional: verify token is still valid on mount by pinging a lightweight endpoint
  }, []);

  return (
<AuthContext.Provider value={{ user, token, role, email, login, logout, loading }}>      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
