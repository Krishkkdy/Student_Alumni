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
  Clock,
  Home,
  Settings
} from 'lucide-react';
import { useUser } from '../../UserContext';

// Import components for different sections
import MentorshipRequests from './MentorshipRequests';
import JobPostings from './JobPostings';
import Events from './Events';
import Network from './Network';
import Profile from '../Profile';
import EditProfile from '../EditProfile';
import AlumniList from '../../AlumniList';

// Alumni Navbar Component
const AlumniNavbar = ({ handleLogout }) => {
  const location = useLocation();
  const { user } = useUser();
  const navigate = useNavigate();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside className="w-64 bg-white shadow-md h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-blue-600">Alumni Portal</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name || 'Alumni'}</p>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              to="/alumni" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni') && !isActive('/alumni/mentorship') && !isActive('/alumni/jobs') && !isActive('/alumni/events') && !isActive('/alumni/network') && !isActive('/alumni/settings') && !isActive('/alumni/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/alumni/profile" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni/profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <User className="h-5 w-5 mr-3" />
              My Profile
            </Link>
          </li>
          <li>
            <Link 
              to="/alumni/edit-profile" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni/edit-profile') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Edit2 className="h-5 w-5 mr-3" />
              Edit Profile
            </Link>
          </li>
          <li>
            <Link 
              to="/alumni/mentorship" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni/mentorship') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <MessageSquare className="h-5 w-5 mr-3" />
              Mentorship
            </Link>
          </li>
          <li>
            <Link 
              to="/alumni/jobs" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni/jobs') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Briefcase className="h-5 w-5 mr-3" />
              Job Postings
            </Link>
          </li>
          <li>
            <Link 
              to="/alumni/events" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni/events') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Events
            </Link>
          </li>
          <li>
            <Link 
              to="/alumni/network" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni/network') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Users className="h-5 w-5 mr-3" />
              Network
            </Link>
          </li>
          <li>
            <Link 
              to="/alumni/settings" 
              className={`flex items-center p-3 rounded-lg ${isActive('/alumni/settings') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t mt-auto">
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name || 'Alumni User'}</p>
            <p className="text-xs text-gray-500">{user?.email || 'alumni@example.com'}</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

// Alumni Settings Component
const AlumniSettings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-6">Settings</h1>
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
          <div className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span className="ml-2 text-sm text-gray-600">Receive mentorship request notifications</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option>Public</option>
            <option>Students Only</option>
            <option>Private</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mentorship Availability</label>
          <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
            <option>Available</option>
            <option>Limited Availability</option>
            <option>Not Available</option>
          </select>
        </div>
      </div>
      <div className="mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  </div>
);

// Dashboard Home Component
const DashboardHome = () => {
  const { user } = useUser();
  const navigate = useNavigate();
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

  return (
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
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{user?.name || 'Alumni User'}</h2>
                <p className="text-gray-500">{user?.email || 'alumni@example.com'}</p>
                <div className="flex mt-2 space-x-2">
                  <Link 
                    to="/alumni/profile" 
                    className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                  >
                    View Profile
                  </Link>
                  <Link 
                    to="/alumni/edit-profile" 
                    className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <AlumniList/>
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
                  onClick={() => navigate('/alumni/profile')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-md bg-indigo-50">
                    <User className="h-5 w-5 text-indigo-500" />
                  </div>
                  <span className="ml-3 font-medium">View My Profile</span>
                </button>
                
                <button 
                  onClick={() => navigate('/alumni/edit-profile')}
                  className="w-full flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="p-2 rounded-md bg-teal-50">
                    <Edit2 className="h-5 w-5 text-teal-500" />
                  </div>
                  <span className="ml-3 font-medium">Edit My Profile</span>
                </button>
                
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
            
            {/* Recent Activity */}
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
};

// Main Alumni Dashboard Component
const AlumniDashboard = ({ handleLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AlumniNavbar handleLogout={handleLogout} />
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto ml-64">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/mentorship/*" element={<MentorshipRequests />} />
          <Route path="/jobs/*" element={<JobPostings />} />
          <Route path="/events/*" element={<Events />} />
          <Route path="/network/*" element={<Network />} />
          <Route path="/settings" element={<AlumniSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AlumniDashboard; 