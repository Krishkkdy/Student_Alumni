import React from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";
import { useUser } from "../UserContext";
import { GraduationCap } from "lucide-react";
import MentorshipRequests from "./alumni/MentorshipRequests";
import JobPostings from "./alumni/JobPostings";
import Network from "./Network";

// Dashboard Home Component
const DashboardHome = () => {
  const { user } = useUser();

  return (
    <>
      {/* Hero Section */}
      <section className="w-screen bg-blue-600 text-white text-center py-24 mt-0">
        <h2 className="text-4xl font-bold">Connect. Learn. Grow.</h2>
        <p className="mt-2 text-lg">An intelligent platform to interconnect Alumni & Students.</p>

        <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="w-screen bg-gray-100 py-12 flex flex-col md:flex-row justify-center gap-6 px-6">
        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">Mentorship</h3>
          <p className="text-gray-600 mt-2">Get career advice from alumni.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">Jobs & Internships</h3>
          <p className="text-gray-600 mt-2">Find opportunities shared by alumni.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg w-full md:w-1/4 text-center">
          <h3 className="text-lg font-semibold text-blue-600">
            <Link
            to="/dashboard/network"
            className=""
          >
            Networking
          </Link></h3>
          <p className="text-gray-600 mt-2">Connect with industry professionals.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="p-10 bg-gray-50 w-screen">
        <h2 className="text-3xl font-bold text-center text-blue-600">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 px-6">
          {[
            { name: "John Doe", feedback: "This platform helped me land my first job!" },
            { name: "Jane Smith", feedback: "Amazing mentorship opportunities from alumni." },
          ].map((review, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-md">
              <p className="text-gray-700">"{review.feedback}"</p>
              <h4 className="mt-2 font-semibold text-blue-600">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center bg-gray-900 text-white py-6 w-screen mb-0">
        <p> 2025 AlumniConnect. All rights reserved.</p>
      </footer>
    </>
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