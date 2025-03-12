import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AlumniDashboard from "./pages/alumni/AlumniDashboard";

// Protected Route Component for Admin
const AdminRoute = ({ children }) => {
  const { user } = useUser();
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Protected Route Component for Alumni
const AlumniRoute = ({ children }) => {
  const { user } = useUser();
  
  if (!user || user.role !== 'alumni') {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Protected Route Component for Students
const StudentRoute = ({ children }) => {
  const { user } = useUser();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route 
            path="/login" 
            element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />} 
          />
          <Route 
            path="/register" 
            element={token ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/dashboard/*" 
            element={
              <StudentRoute>
                <Dashboard handleLogout={handleLogout} />
              </StudentRoute>
            } 
          />
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard handleLogout={handleLogout} />
              </AdminRoute>
            } 
          />
          <Route 
            path="/alumni/*" 
            element={
              <AlumniRoute>
                <AlumniDashboard handleLogout={handleLogout} />
              </AlumniRoute>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
