import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  User,
  LogOut,
  Edit2,
  Settings,
  Home
} from 'lucide-react';
import { useUser } from '../../UserContext';

// Import components
import AlumniDashboardHome from './AlumniDashboardHome';
import MentorshipRequests from './MentorshipRequests';
import JobPostings from './JobPostings';
import Events from './Events';
import Network from './Network';
import Profile from '../Profile';
import EditProfile from '../EditProfile';
import ProfileView from './ProfileView';

// Alumni Navbar Component
const AlumniNavbar = ({ handleLogout }) => {
  const location = useLocation();
  const { user } = useUser();

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

// Main Alumni Dashboard Component
const AlumniDashboard = ({ handleLogout }) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <AlumniNavbar handleLogout={handleLogout} />
      <main className="flex-1 overflow-x-hidden overflow-y-auto ml-64">
        <Routes>
          <Route path="/" element={<AlumniDashboardHome />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/mentorship/*" element={<MentorshipRequests />} />
          <Route path="/jobs/*" element={<JobPostings />} />
          <Route path="/events/*" element={<Events />} />
          <Route path="/network/*" element={<Network />} />
          <Route path="/profile-view/:id" element={<ProfileView />} />
        </Routes>
      </main>
    </div>
  );
};

export default AlumniDashboard; 