import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

axios.defaults.withCredentials = true;

const API = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= CHECK AUTH =================
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${API}/me`);
      setUser(res.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API}/login`, {
        email,
        password,
      });

      setUser(res.data.user);
      return { success: true };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // ================= SIGNUP =================
  const signup = async (name, email, password) => {
    try {
      await axios.post(`${API}/signup`, {
        name,
        email,
        password,
      });

      return { success: true };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    }
  };

  // ================= GOOGLE LOGIN =================
  const googleLogin = async (token) => {
    try {
      const res = await axios.post(`${API}/google`, { token });
      setUser(res.data.user);
      return { success: true };

    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Google login failed",
      };
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await axios.post(`${API}/logout`);
      setUser(null);
    } catch (error) {
      console.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};