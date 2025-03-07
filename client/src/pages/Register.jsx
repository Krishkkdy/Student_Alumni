import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

function Register() {
  const [userData, setUserData] = useState({ 
    username: "", 
    email: "", 
    password: "" 
  });

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[^a-zA-Z0-9]+/)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (passwordStrength < 3) {
        setError("Password is too weak. Please use a stronger password.");
        return;
    }

    setIsLoading(true);
    setError("");

    try {
        const res = await axios.post("http://localhost:3000/api/auth/signup", userData);
        navigate("/login", { state: { successMessage: "Successfully registered! Please log in." } });
    } catch (error) {
        setError(error.response?.data?.message || "Registration failed! Please check your connection.");
        setIsLoading(false);
    }
};

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
      case 5:
        return "bg-green-600";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
              <p className="text-gray-500 mt-2">Sign up to get started</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Username Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="text-gray-400 h-5 w-5" />
                </div>
                <input 
                  type="text" 
                  name="username" 
                  placeholder="Username" 
                  value={userData.username} 
                  onChange={handleChange}
                  required
                  minLength={3}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400 h-5 w-5" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email Address" 
                  value={userData.email} 
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 h-5 w-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  placeholder="Password" 
                  value={userData.password} 
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-500 transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              <div className="flex space-x-1 h-1.5">
                {[1, 2, 3, 4, 5].map((section) => (
                  <div 
                    key={section} 
                    className={`flex-1 rounded-full ${
                      section <= passwordStrength 
                        ? getPasswordStrengthColor() 
                        : "bg-gray-200"
                    } transition-colors duration-300`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {passwordStrength === 0 && "Password is very weak"}
                {passwordStrength === 1 && "Password is weak"}
                {passwordStrength === 2 && "Password is moderate"}
                {passwordStrength === 3 && "Password is strong"}
                {passwordStrength >= 4 && "Password is very strong"}
              </p>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              {/* Register Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-gray-600">
                Already have an account? {" "}
                <a 
                  href="/login" 
                  className="text-purple-600 hover:underline font-semibold"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;