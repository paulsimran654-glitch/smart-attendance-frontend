import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import QRDisplay from "./pages/QRDisplay";
import ScanQR from "./pages/ScanQR";
import History from "./pages/History";

import AdminLayout from "./layouts/AdminLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Route */}
          <Route path="/login" element={<Login />} />

          {/* QR Display Screen (Entrance Device) */}
          <Route path="/qr-display" element={<QRDisplay />} />

          {/* ================= ADMIN ROUTES ================= */}

          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
          </Route>


          {/* ================= EMPLOYEE ROUTES ================= */}

          <Route
            path="/employee"
            element={
              <ProtectedRoute role="employee">
                <EmployeeLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="scan" element={<ScanQR />} />
            <Route path="history" element={<History />} />
          </Route>


          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;