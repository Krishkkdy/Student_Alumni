import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../UserContext';
import {
  Users,
  Briefcase,
  Calendar,
  MessageSquare,
  BarChart2,
  TrendingUp,
  Award,
  Clock,
  Bell,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Activity
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, trend, color }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transform transition-all hover:scale-105 hover:shadow-lg`}>
    <div className="flex items-center justify-between">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <div className={`flex items-center ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          <TrendingUp className={`w-4 h-4 ${trend > 0 ? '' : 'transform rotate-180'}`} />
          <span className="ml-1 text-sm font-medium">{Math.abs(trend)}%</span>
        </div>
      )}
    </div>
    <h3 className="mt-4 text-2xl font-bold text-gray-900">{value}</h3>
    <p className="text-gray-600 text-sm">{title}</p>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, status, statusColor }) => (
  <div className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors">
    <div className={`w-10 h-10 rounded-lg ${statusColor} flex items-center justify-center`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="ml-4 flex-1">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
      status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
      status === 'Completed' ? 'bg-green-100 text-green-800' :
      'bg-red-100 text-red-800'
    }`}>
      {status}
    </div>
  </div>
);

const AlumniDashboardHome = () => {
  const { user } = useUser();
  const [dashboardStats, setDashboardStats] = useState({
    mentorshipRequests: 5,
    activeMentorships: 3,
    jobPostings: 8,
    upcomingEvents: 2,
    connections: 156,
    profileViews: 42
  });
  const [recentActivity, setRecentActivity] = useState([
    {
      icon: MessageSquare,
      title: "New mentorship request from John Smith",
      time: "10 minutes ago",
      status: "Pending",
      statusColor: "bg-yellow-500"
    },
    {
      icon: Briefcase,
      title: "Your job posting received 5 applications",
      time: "2 hours ago",
      status: "Active",
      statusColor: "bg-green-500"
    },
    {
      icon: Calendar,
      title: "Tech Talk event starting soon",
      time: "Tomorrow, 3:00 PM",
      status: "Upcoming",
      statusColor: "bg-blue-500"
    }
  ]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name || 'Alumni'}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening in your alumni network</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={MessageSquare}
          title="Mentorship Requests"
          value={dashboardStats.mentorshipRequests}
          trend={12}
          color="bg-blue-500"
        />
        <StatCard
          icon={Users}
          title="Active Mentorships"
          value={dashboardStats.activeMentorships}
          trend={5}
          color="bg-green-500"
        />
        <StatCard
          icon={Briefcase}
          title="Job Postings"
          value={dashboardStats.jobPostings}
          trend={-2}
          color="bg-purple-500"
        />
        <StatCard
          icon={Calendar}
          title="Upcoming Events"
          value={dashboardStats.upcomingEvents}
          color="bg-orange-500"
        />
        <StatCard
          icon={Users}
          title="Network Connections"
          value={dashboardStats.connections}
          trend={8}
          color="bg-indigo-500"
        />
        <StatCard
          icon={BarChart2}
          title="Profile Views"
          value={dashboardStats.profileViews}
          trend={15}
          color="bg-pink-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/alumni/mentorship/create"
              className="flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <MessageSquare className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">Review Mentorship Requests</span>
            </Link>
            <Link
              to="/alumni/jobs/post"
              className="flex flex-col items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <Briefcase className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">Post a Job</span>
            </Link>
            <Link
              to="/alumni/events/create"
              className="flex flex-col items-center p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              <Calendar className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">Create Event</span>
            </Link>
            <Link
              to="/alumni/network"
              className="flex flex-col items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
            >
              <Users className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">Browse Network</span>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/alumni/activity" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Preview */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Upcoming Events</h2>
          <Link to="/alumni/events" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
            View Calendar <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                Tech Talk
              </div>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <h3 className="font-medium mb-2">Future of AI in Industry</h3>
            <p className="text-sm text-gray-600 mb-3">Tomorrow, 3:00 PM</p>
            <button className="w-full bg-white border border-gray-200 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              Join Event
            </button>
          </div>
          {/* Add more event cards as needed */}
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboardHome; 