import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Clock,
  User,
  Calendar,
  BookOpen,
  Tag
} from 'lucide-react';

const MentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [responseMessage, setResponseMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);

  useEffect(() => {
    fetchMentorshipRequests();
  }, []);

  const fetchMentorshipRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/alumni/mentorship/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch mentorship requests. Please try again later.');
      console.error('Error fetching mentorship requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = (request) => {
    setSelectedRequest(request);
    setResponseMessage('');
    setShowResponseModal(true);
  };

  const submitResponse = async (status) => {
    try {
      if (!selectedRequest) return;
      
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/alumni/mentorship/respond/${selectedRequest._id}`,
        { status, message: responseMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setRequests(requests.map(req => 
        req._id === selectedRequest._id 
          ? { ...req, status, message: responseMessage } 
          : req
      ));
      
      setShowResponseModal(false);
      setSelectedRequest(null);
      setResponseMessage('');
    } catch (err) {
      setError('Failed to respond to mentorship request. Please try again.');
      console.error('Error responding to mentorship request:', err);
    }
  };

  const filteredRequests = requests.filter(request => {
    if (activeTab === 'pending') return request.status === 'pending';
    if (activeTab === 'accepted') return request.status === 'accepted';
    if (activeTab === 'rejected') return request.status === 'rejected';
    return true;
  });

  // Response Modal Component
  const ResponseModal = () => {
    if (!showResponseModal) return null;
    
    return (
      <>
        <div 
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40"
          onClick={() => setShowResponseModal(false)}
        />
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Respond to Mentorship Request</h2>
              <button
                onClick={() => setShowResponseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  From: <span className="font-medium text-gray-800">
                    {selectedRequest?.student?.profile?.firstName} {selectedRequest?.student?.profile?.lastName}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Topics: <span className="font-medium text-gray-800">
                    {selectedRequest?.topics?.join(', ')}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Message: <span className="font-medium text-gray-800">
                    {selectedRequest?.message}
                  </span>
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Response
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                  placeholder="Write a message to the student..."
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => submitResponse('rejected')}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Decline
                </button>
                <button
                  onClick={() => submitResponse('accepted')}
                  className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
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
      <h1 className="text-2xl font-bold mb-6">Mentorship Requests</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'pending'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pending')}
        >
          Pending
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="ml-2 bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">
              {requests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'accepted'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'rejected'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('rejected')}
        >
          Declined
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
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No {activeTab} mentorship requests</h3>
              <p className="text-gray-500">
                {activeTab === 'pending' 
                  ? "You don't have any pending mentorship requests at the moment."
                  : activeTab === 'accepted'
                  ? "You haven't accepted any mentorship requests yet."
                  : "You haven't declined any mentorship requests yet."}
              </p>
            </div>
          ) : (
            /* Request Cards */
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div 
                  key={request._id} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                        {request.student?.profile?.firstName?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">
                          {request.student?.profile?.firstName} {request.student?.profile?.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.student?.academic?.major || 'Student'}, {request.student?.academic?.graduationYear || 'Unknown Year'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {request.status === 'pending' ? (
                        <span className="flex items-center text-sm bg-yellow-100 text-yellow-700 py-1 px-3 rounded-full">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      ) : request.status === 'accepted' ? (
                        <span className="flex items-center text-sm bg-green-100 text-green-700 py-1 px-3 rounded-full">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Accepted
                        </span>
                      ) : (
                        <span className="flex items-center text-sm bg-red-100 text-red-700 py-1 px-3 rounded-full">
                          <XCircle className="h-3 w-3 mr-1" />
                          Declined
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Tag className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Topics of Interest</p>
                        <div className="flex flex-wrap gap-2">
                          {request.topics?.map((topic, index) => (
                            <span 
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 py-1 px-2 rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Requested On</p>
                        <p className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-1">Message</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg">
                      {request.message || "No message provided."}
                    </p>
                  </div>
                  
                  {request.status === 'pending' && (
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleRespond(request)}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Respond
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Response Modal */}
      <ResponseModal />
    </div>
  );
};

export default MentorshipRequests; 