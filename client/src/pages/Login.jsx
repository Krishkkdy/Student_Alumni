import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, UserPlus, GraduationCap } from "lucide-react";
import { useUser } from "../UserContext";

// Role Selection Modal Component
const RoleSelectionModal = ({ onSelect, onClose }) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300" />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 transform transition-all duration-300 scale-100 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Select Your Role</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => onSelect('student')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Student</span>
            </button>
            <button
              onClick={() => onSelect('alumni')}
              className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="h-16 w-16 bg-blue-100 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <span className="font-medium text-gray-900">Alumni</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

function Login({ setToken }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [loginResponse, setLoginResponse] = useState(null);
  const navigate = useNavigate();
  const { updateUser } = useUser();
  const location = useLocation();
  const successMessage = location.state?.successMessage || "";

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRoleSelect = async (selectedRole) => {
    try {
      // Update the user's role in the profile
      const token = loginResponse.token;
      await axios.patch(
        `http://localhost:3000/api/admin/users/${loginResponse.user._id}/role`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Store token
      localStorage.setItem("token", token);
      setToken(token);

      // Update user data with selected role
      const userData = {
        name: loginResponse.user.name || 'User',
        email: loginResponse.user.email,
        role: selectedRole,
        id: loginResponse.user._id
      };
      updateUser(userData);

      setShowRoleSelection(false);
      
      // Redirect based on role
      if (selectedRole === 'alumni') {
        console.log("Role selected as alumni, redirecting to alumni dashboard...");
        navigate("/alumni");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Error updating role:', error);
      setError("Failed to update role. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", credentials);
      setLoginResponse(res.data);

      if (!res.data.user.role) {
        // If no role is set, show role selection
        setShowRoleSelection(true);
      } else if (res.data.user.role === 'admin') {
        // If admin, proceed to admin dashboard
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        updateUser({
          name: res.data.user.name || 'User',
          email: res.data.user.email,
          role: res.data.user.role,
        });
        navigate("/admin");
      } else if (res.data.user.role === 'alumni') {
        // If alumni, redirect to alumni dashboard
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        updateUser({
          name: res.data.user.name || 'User',
          email: res.data.user.email,
          role: res.data.user.role,
          id: res.data.user._id
        });
        console.log("Redirecting to alumni dashboard...");
        navigate("/alumni");
      } else {
        // If student, redirect to student dashboard
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        updateUser({
          name: res.data.user.name || 'User',
          email: res.data.user.email,
          role: res.data.user.role,
          id: res.data.user._id
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all duration-300 hover:shadow-3xl">
            <div className="p-8">
              <div>
                {successMessage && (
                  <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg mb-6 flex items-center space-x-2 transition-all duration-300 transform translate-y-0 opacity-100">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{successMessage}</span>
                  </div>
                )}
              </div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
                <p className="text-gray-600">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:border-blue-300"
                  />
                </div>

                {/* Password Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400 h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 hover:border-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center space-x-2 transition-all duration-300">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              {/* Registration Link */}
              <div className="text-center mt-8">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <a
                    href="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all duration-200"
                  >
                    Create one now
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleSelection && (
        <RoleSelectionModal
          onSelect={handleRoleSelect}
          onClose={() => setShowRoleSelection(false)}
        />
      )}
    </>
  );
}

export default Login;