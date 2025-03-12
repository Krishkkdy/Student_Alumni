import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  BarChart2, 
  User,
  LogOut,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useUser } from '../../UserContext';

// Import components for different sections
import MentorshipRequests from './MentorshipRequests';
import JobPostings from './JobPostings';

const AlumniDashboard = ({ handleLogout }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardStats, setDashboardStats] = useState({
    mentorshipRequests: 0,
    activeMentorships: 0,
    jobPostings: 0,
    upcomingEvents: 0,
    connections: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        // For now, we'll use mock data since the API endpoint might not be ready
        // In a real implementation, this would be replaced with an actual API call
        
        // Simulating API response with mock data
        setTimeout(() => {
          setDashboardStats({
            mentorshipRequests: 3,
            activeMentorships: 2,
            jobPostings: 5,
            upcomingEvents: 1,
            connections: 12
          });
          setLoading(false);
        }, 1000);
        
        // Commented out actual API call until backend is ready
        /*
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/alumni/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardStats(response.data);
        setLoading(false);
        */
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Placeholder components for routes that will be implemented separately
  const DashboardHome = () => (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Alumni Dashboard</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Stats Cards */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-50">
                  <MessageSquare className="h-6 w-6 text-blue-500" />
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
                  <Users className="h-6 w-6 text-green-500" />
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
                  <Briefcase className="h-6 w-6 text-purple-500" />
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
                  <Calendar className="h-6 w-6 text-amber-500" />
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
                  <Users className="h-6 w-6 text-rose-500" />
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
                      <MessageSquare className="h-5 w-5 text-blue-500" />
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
                    <Briefcase className="h-5 w-5 text-purple-500" />
                  </div>
                  <span className="ml-3 font-medium">Post a New Job</span>
                </button>
                
                <button 
                  onClick={() => navigate('/alumni/events/new')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-md bg-amber-50">
                    <Calendar className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="ml-3 font-medium">Create an Event</span>
                </button>
                
                <button 
                  onClick={() => navigate('/alumni/network')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-md bg-rose-50">
                    <Users className="h-5 w-5 text-rose-500" />
                  </div>
                  <span className="ml-3 font-medium">Browse Students</span>
                </button>
              </div>
            </div>
            
            {/* Recent Activity - Placeholder */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-blue-50 mt-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">New mentorship request from John Doe</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-green-50 mt-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Your job posting received 5 new applications</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-amber-50 mt-1">
                    <Calendar className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">Your event "Career in Tech" is tomorrow</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="p-2 rounded-md bg-rose-50 mt-1">
                    <Users className="h-4 w-4 text-rose-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">New connection request from Jane Smith</p>
                    <p className="text-xs text-gray-500">3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Alumni Portal</h1>
        </div>
        
        <div className="p-4">
          <nav className="space-y-1">
            <Link
              to="/alumni"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                location.pathname === '/alumni'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BarChart2 className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              to="/alumni/profile"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                location.pathname === '/alumni/profile'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              My Profile
            </Link>
            
            <Link
              to="/alumni/mentorship"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                location.pathname.includes('/alumni/mentorship')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              Mentorship
              {dashboardStats.mentorshipRequests > 0 && (
                <span className="ml-auto bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">
                  {dashboardStats.mentorshipRequests}
                </span>
              )}
            </Link>
            
            <Link
              to="/alumni/jobs"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                location.pathname.includes('/alumni/jobs')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Briefcase className="mr-3 h-5 w-5" />
              Job Postings
            </Link>
            
            <Link
              to="/alumni/events"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                location.pathname.includes('/alumni/events')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              Events
            </Link>
            
            <Link
              to="/alumni/network"
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                location.pathname.includes('/alumni/network')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="mr-3 h-5 w-5" />
              Networking
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.profile?.firstName?.charAt(0) || user?.username?.charAt(0) || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.profile?.firstName 
                  ? `${user.profile.firstName} ${user.profile.lastName || ''}`
                  : user?.username}
              </p>
              <p className="text-xs text-gray-500">Alumni</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-gray-800">Alumni Portal</h1>
          <button className="p-2 rounded-md bg-gray-100">
            <span className="sr-only">Open menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<div className="p-6"><h1 className="text-2xl font-bold">My Profile</h1></div>} />
          <Route path="/mentorship/*" element={<MentorshipRequests />} />
          <Route path="/jobs/*" element={<JobPostings />} />
          <Route path="/events/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Events</h1></div>} />
          <Route path="/network/*" element={<div className="p-6"><h1 className="text-2xl font-bold">Networking</h1></div>} />
        </Routes>
      </div>
    </div>
  );
};

export default AlumniDashboard; 