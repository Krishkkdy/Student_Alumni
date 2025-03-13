import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  Calendar, 
  PlusCircle, 
  Edit2, 
  Trash2, 
  MapPin,
  Users,
  Clock,
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/" element={<EventsList />} />
      <Route path="/new" element={<EventForm />} />
      <Route path="/edit/:eventId" element={<EventForm />} />
    </Routes>
  );
};

// Events Listings Component
const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data for now - would be replaced with API call
    setTimeout(() => {
      setEvents([
        {
          _id: '1',
          title: 'Career in Tech Workshop',
          description: 'Join us for a workshop on navigating tech careers in 2025.',
          date: '2025-03-15T14:00:00',
          location: 'Virtual (Zoom)',
          maxAttendees: 50,
          currentAttendees: 12,
          createdBy: 'John Doe'
        },
        {
          _id: '2',
          title: 'Alumni Networking Mixer',
          description: 'Connect with fellow alumni and current students in this casual networking event.',
          date: '2025-04-10T18:00:00',
          location: 'Main Campus, Building B',
          maxAttendees: 100,
          currentAttendees: 45,
          createdBy: 'Jane Smith'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (!eventToDelete) return;
      
      // Mock deletion - would be replaced with API call
      setEvents(events.filter(event => event._id !== eventToDelete._id));
      setShowDeleteModal(false);
      setEventToDelete(null);
    } catch (err) {
      setError('Failed to delete event. Please try again.');
      console.error('Error deleting event:', err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Delete Confirmation Modal
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;
    
    return (
      <>
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
          onClick={() => setShowDeleteModal(false)}
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Delete Event</h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-center mb-2">
                Are you sure you want to delete this event?
              </h3>
              
              <p className="text-sm text-gray-500 text-center mb-6">
                This action cannot be undone. The event "{eventToDelete?.title}" will be permanently removed.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Events</h1>
        <button
          onClick={() => navigate('/alumni/events/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Event
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-500 mb-6">
                Create events to connect with students and fellow alumni.
              </p>
              <button
                onClick={() => navigate('/alumni/events/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Event
              </button>
            </div>
          ) : (
            /* Event Cards */
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event._id} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{event.currentAttendees} / {event.maxAttendees} attendees</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 mt-4 md:mt-0">
                      <button
                        onClick={() => navigate(`/alumni/events/edit/${event._id}`)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(event)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Created by: {event.createdBy}
                    </div>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal />
    </div>
  );
};

// Event Form Component
const EventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const isEditMode = pathname.includes('/edit');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: 50,
    isVirtual: false,
    virtualLink: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      // Mock data fetch for edit mode - would be replaced with API call
      setFormData({
        title: 'Career in Tech Workshop',
        description: 'Join us for a workshop on navigating tech careers in 2025.',
        date: '2025-03-15',
        time: '14:00',
        location: 'Virtual (Zoom)',
        maxAttendees: 50,
        isVirtual: true,
        virtualLink: 'https://zoom.us/j/123456789'
      });
    }
  }, [isEditMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Mock form submission - would be replaced with API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/alumni/events');
      }, 1500);
    } catch (err) {
      setError('Failed to save event. Please try again.');
      console.error('Error saving event:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <button
        onClick={() => navigate('/alumni/events')}
        className="flex items-center text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </button>
      
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Event successfully {isEditMode ? 'updated' : 'created'}!
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title*
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the event"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time*
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <input
                  type="checkbox"
                  name="isVirtual"
                  checked={formData.isVirtual}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                />
                This is a virtual event
              </label>
            </div>
            
            {formData.isVirtual ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Virtual Meeting Link*
                </label>
                <input
                  type="url"
                  name="virtualLink"
                  value={formData.virtualLink}
                  onChange={handleChange}
                  required={formData.isVirtual}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://zoom.us/j/123456789"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location*
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required={!formData.isVirtual}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter event location"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Attendees*
              </label>
              <input
                type="number"
                name="maxAttendees"
                value={formData.maxAttendees}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/alumni/events')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                {loading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                )}
                {isEditMode ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Events;
