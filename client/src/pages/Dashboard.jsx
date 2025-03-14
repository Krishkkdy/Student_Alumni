import React from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Profile from "./Profile";
import { useUser } from "../UserContext";
import { GraduationCap } from "lucide-react";
import MentorshipRequests from "./alumni/MentorshipRequests";
import JobPostings from "./alumni/JobPostings";

// Dashboard Home Component
const DashboardHome = () => {
  const { user } = useUser();
  const location = useLocation();
  
  // If we're on the alumni route, show alumni dashboard
  if (location.pathname === "/alumni") {
    return <AlumniHome />;
  }
  
  return (
    <>
      {/* Hero Section */}
      <section className="w-screen bg-blue-600 text-white text-center py-24 mt-0">
        <h2 className="text-4xl font-bold">Connect. Learn. Grow.</h2>
        <p className="mt-2 text-lg">An intelligent platform to interconnect Alumni & Students.</p>
        
        {user?.role === 'alumni' && (
          <Link to="/alumni" className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 inline-flex items-center">
            <GraduationCap className="mr-2" size={18} />
            Go to Alumni Portal
          </Link>
        )}
        {!user?.role || user.role !== 'alumni' ? (
          <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200">
            Get Started
          </button>
        ) : null}
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
          <h3 className="text-lg font-semibold text-blue-600">Networking</h3>
          <p className="text-gray-600 mt-2">Connect with industry professionals.</p>
        </div>
      </section>

      {/* Alumni Portal Banner - Only shown to alumni users */}
      {user?.role === 'alumni' && (
        <section className="w-screen bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Alumni Portal Access</h2>
          <p className="mb-4">As an alumni, you have access to special features to help students and share opportunities.</p>
          <Link to="/alumni" className="bg-white text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-gray-200 inline-flex items-center">
            <GraduationCap className="mr-2" size={18} />
            Access Alumni Portal
          </Link>
        </section>
      )}

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

// Alumni Home Component
const AlumniHome = () => {
  const [dashboardStats, setDashboardStats] = React.useState({
    mentorshipRequests: 3,
    activeMentorships: 2,
    jobPostings: 5,
    upcomingEvents: 1,
    connections: 12
  });
  const navigate = useNavigate();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Alumni Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <div className="h-6 w-6 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Mentorship Requests</h3>
              <p className="text-2xl font-semibold">{dashboardStats.mentorshipRequests}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <div className="h-6 w-6 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Active Mentorships</h3>
              <p className="text-2xl font-semibold">{dashboardStats.activeMentorships}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-50">
              <div className="h-6 w-6 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Job Postings</h3>
              <p className="text-2xl font-semibold">{dashboardStats.jobPostings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-amber-50">
              <div className="h-6 w-6 text-amber-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Upcoming Events</h3>
              <p className="text-2xl font-semibold">{dashboardStats.upcomingEvents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-rose-50">
              <div className="h-6 w-6 text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Network Connections</h3>
              <p className="text-2xl font-semibold">{dashboardStats.connections}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/alumni/mentorship')}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="p-2 rounded-md bg-blue-50">
                  <div className="h-5 w-5 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
                <span className="ml-3 font-medium">View Mentorship Requests</span>
              </div>
              <span className="text-sm bg-blue-100 text-blue-700 py-1 px-2 rounded-full">
                {dashboardStats.mentorshipRequests}
              </span>
            </button>
            
            <button 
              onClick={() => navigate('/alumni/jobs/new')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-md bg-purple-50">
                <div className="h-5 w-5 text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
              </div>
              <span className="ml-3 font-medium">Post a New Job</span>
            </button>
            
            <button 
              onClick={() => navigate('/alumni/events/new')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-md bg-amber-50">
                <div className="h-5 w-5 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <span className="ml-3 font-medium">Create an Event</span>
            </button>
            
            <button 
              onClick={() => navigate('/alumni/network')}
              className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 rounded-md bg-rose-50">
                <div className="h-5 w-5 text-rose-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <span className="ml-3 font-medium">Browse Students</span>
            </button>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-blue-50 mt-1">
                <div className="h-4 w-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">New mentorship request from John Doe</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-green-50 mt-1">
                <div className="h-4 w-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Your job posting received 5 new applications</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-amber-50 mt-1">
                <div className="h-4 w-4 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Your event "Career in Tech" is tomorrow</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-rose-50 mt-1">
                <div className="h-4 w-4 text-rose-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">New connection request from Jane Smith</p>
                <p className="text-xs text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
const Network = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Networking</h1>
    <p className="text-gray-600 mt-2">Connect with students and other alumni</p>
    
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
      <p>The networking feature is under development.</p>
    </div>
  </div>
);

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

const Dashboard = ({ handleLogout }) => {
  return (
    <div className="w-full min-h-screen bg-gray-100 overflow-hidden mx-0">
      <Navbar handleLogout={handleLogout} />
      <div className="pt-16"> {/* Add padding top to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Alumni Routes */}
          <Route path="/alumni" element={<DashboardHome />} />
          <Route path="/alumni/mentorship/*" element={<MentorshipRequests />} />
          <Route path="/alumni/jobs/*" element={<JobPostings />} />
          <Route path="/alumni/events/*" element={<Events />} />
          <Route path="/alumni/network/*" element={<Network />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
