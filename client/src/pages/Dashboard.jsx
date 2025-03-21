import React from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";
import { useUser } from "../UserContext";
import { GraduationCap, Users, Briefcase, Calendar, ChevronRight, Star, MessageCircle } from "lucide-react";
import MentorshipRequests from "./alumni/MentorshipRequests";
import JobPostings from "./alumni/JobPostings";
import Network from "./Network";

// Dashboard Home Component
const DashboardHome = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with Animated Gradient */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">
            Welcome to AlumniConnect
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            Bridge the gap between students and alumni. Connect with mentors, discover opportunities, and grow your professional network.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Find a Mentor
            </button>
            <button className="bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Browse Events
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center transform transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-xl mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600 mt-2">Active Alumni</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center transform transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 text-white rounded-xl mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">200+</h3>
              <p className="text-gray-600 mt-2">Job Opportunities</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 text-center transform transition-all hover:scale-105">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-xl mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900">50+</h3>
              <p className="text-gray-600 mt-2">Monthly Events</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Explore Our Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Mentorship</h3>
              </div>
              <p className="text-gray-600 mb-4">Connect with experienced alumni for career guidance and professional advice.</p>
              <Link to="/mentorship" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                Learn More <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Job Board</h3>
              </div>
              <p className="text-gray-600 mb-4">Exclusive job and internship opportunities posted by our alumni network.</p>
              <Link to="/jobs" className="inline-flex items-center text-purple-600 hover:text-purple-700">
                View Opportunities <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8 transform transition-all hover:scale-105 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold ml-4">Networking</h3>
              </div>
              <p className="text-gray-600 mb-4">Build meaningful connections with alumni and fellow students.</p>
              <Link to="/dashboard/network" className="inline-flex items-center text-green-600 hover:text-green-700">
                Start Networking <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                name: "John Doe",
                role: "Software Engineer at Google",
                feedback: "The mentorship I received through this platform was invaluable. It helped me land my dream job!",
                rating: 5
              },
              {
                name: "Jane Smith",
                role: "Product Manager at Microsoft",
                feedback: "I found my current role through the alumni network. The support from the community is amazing!",
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 transform transition-all hover:scale-105">
                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-4">"{review.feedback}"</p>
                <div>
                  <h4 className="font-semibold text-gray-900">{review.name}</h4>
                  <p className="text-blue-600">{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join our growing community of students and alumni.</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Complete Your Profile
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">AlumniConnect</h3>
              <p className="text-gray-400">Bridging the gap between students and alumni.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/mentorship" className="text-gray-400 hover:text-white">Find a Mentor</Link></li>
                <li><Link to="/jobs" className="text-gray-400 hover:text-white">Job Board</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white">Upcoming Events</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">support@alumniconnect.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 AlumniConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Events Component
const Events = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Events</h1>
    <p className="text-gray-600 mt-2">Manage and create alumni events</p>

    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
      <p>The events management feature is under development.</p>
    </div>
  </div>
);

// Network Component
const Networkdet = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
      </h1>
      <p className="text-gray-600 mt-2">Connect with students and other alumni</p>

      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p>The networking feature is under development.</p>

        {/* Link to redirect to /dashboard/network */}

      </div>
    </div>
  );
};

// Settings Component
const Settings = () => (
  <div className="p-6">
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Settings</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Email notifications for new messages</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Email notifications for event updates</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Email notifications for job opportunities</span>
            </label>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Make profile visible to other users</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600" />
              <span>Show email address in profile</span>
            </label>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  </div>
);

// Main Dashboard Component
const Dashboard = ({ handleLogout }) => {
  const { user } = useUser();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar handleLogout={handleLogout} />

      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/events" element={<Events />} />
          <Route path="/network" element={<Network />} />
          <Route path="/networkdet" element={<Networkdet />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;