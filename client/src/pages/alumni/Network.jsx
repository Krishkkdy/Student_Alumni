import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Search, 
  Filter, 
  MessageSquare, 
  UserPlus,
  Briefcase,
  GraduationCap,
  MapPin,
  Tag,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

const Network = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: '',
    major: '',
    interests: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [connectionRequests, setConnectionRequests] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Mock data for now - would be replaced with API call
      setTimeout(() => {
        setStudents([
          {
            _id: '1',
            name: 'John Smith',
            profileImage: null,
            year: 'Senior',
            major: 'Computer Science',
            interests: ['Artificial Intelligence', 'Web Development', 'Cybersecurity'],
            bio: 'Passionate about AI and machine learning. Looking for mentorship in the tech industry.',
            location: 'New York, NY'
          },
          {
            _id: '2',
            name: 'Emily Johnson',
            profileImage: null,
            year: 'Junior',
            major: 'Business Administration',
            interests: ['Marketing', 'Entrepreneurship', 'Finance'],
            bio: 'Aspiring entrepreneur interested in startups and venture capital.',
            location: 'Boston, MA'
          },
          {
            _id: '3',
            name: 'Michael Chen',
            profileImage: null,
            year: 'Sophomore',
            major: 'Electrical Engineering',
            interests: ['Robotics', 'IoT', 'Renewable Energy'],
            bio: 'Working on innovative IoT projects. Seeking guidance in the engineering field.',
            location: 'San Francisco, CA'
          },
          {
            _id: '4',
            name: 'Sophia Rodriguez',
            profileImage: null,
            year: 'Senior',
            major: 'Psychology',
            interests: ['Clinical Psychology', 'Research', 'Neuroscience'],
            bio: 'Interested in pursuing a PhD in Clinical Psychology. Looking for research opportunities.',
            location: 'Chicago, IL'
          },
          {
            _id: '5',
            name: 'David Kim',
            profileImage: null,
            year: 'Freshman',
            major: 'Undecided',
            interests: ['Data Science', 'Economics', 'Public Policy'],
            bio: 'Exploring different fields and seeking guidance on career paths.',
            location: 'Seattle, WA'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };

  const handleConnect = async (studentId) => {
    try {
      // Mock connection request - would be replaced with API call
      setConnectionRequests({
        ...connectionRequests,
        [studentId]: 'pending'
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectionRequests({
        ...connectionRequests,
        [studentId]: 'connected'
      });
      
      setSuccessMessage('Connection request sent successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to send connection request. Please try again.');
      console.error('Error sending connection request:', err);
    }
  };

  const handleMessage = (studentId) => {
    // This would navigate to a messaging interface or open a modal
    console.log(`Message student with ID: ${studentId}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleInterestFilter = (interest) => {
    const currentInterests = filters.interests;
    if (currentInterests.includes(interest)) {
      setFilters({
        ...filters,
        interests: currentInterests.filter(i => i !== interest)
      });
    } else {
      setFilters({
        ...filters,
        interests: [...currentInterests, interest]
      });
    }
  };

  const resetFilters = () => {
    setFilters({
      year: '',
      major: '',
      interests: []
    });
  };

  // Filter students based on search term and filters
  const filteredStudents = students.filter(student => {
    // Search term filter
    if (searchTerm && !student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !student.major.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !student.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Year filter
    if (filters.year && student.year !== filters.year) {
      return false;
    }
    
    // Major filter
    if (filters.major && student.major !== filters.major) {
      return false;
    }
    
    // Interests filter
    if (filters.interests.length > 0 && 
        !filters.interests.some(interest => student.interests.includes(interest))) {
      return false;
    }
    
    return true;
  });

  // Get unique values for filter dropdowns
  const uniqueYears = [...new Set(students.map(student => student.year))];
  const uniqueMajors = [...new Set(students.map(student => student.major))];
  const uniqueInterests = [...new Set(students.flatMap(student => student.interests))];

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Network</h1>
      
      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
          <XCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, major, or interests..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  name="year"
                  value={filters.year}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Years</option>
                  {uniqueYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                <select
                  name="major"
                  value={filters.major}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Majors</option>
                  {uniqueMajors.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {uniqueInterests.map(interest => (
                    <button
                      key={interest}
                      onClick={() => handleInterestFilter(interest)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.interests.includes(interest)
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredStudents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || filters.year || filters.major || filters.interests.length > 0
                  ? 'Try adjusting your search or filters to find students.'
                  : 'There are no students available for networking at this time.'}
              </p>
              {(searchTerm || filters.year || filters.major || filters.interests.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          ) : (
            /* Student Cards */
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div 
                  key={student._id} 
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start">
                    <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      {student.profileImage ? (
                        <img 
                          src={student.profileImage} 
                          alt={student.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                          <span className="text-lg font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {getInitials(student.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-gray-900 mb-1">{student.name}</h2>
                      
                      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2">
                        <div className="flex items-center mr-4">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          <span>{student.year}</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>{student.major}</span>
                        </div>
                        {student.location && (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{student.location}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{student.bio}</p>
                      
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          {student.interests.map((interest, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConnect(student._id)}
                          disabled={connectionRequests[student._id] === 'pending' || connectionRequests[student._id] === 'connected'}
                          className={`px-4 py-2 rounded-lg text-sm flex items-center ${
                            connectionRequests[student._id] === 'connected'
                              ? 'bg-green-50 text-green-600'
                              : connectionRequests[student._id] === 'pending'
                                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                          } transition-colors`}
                        >
                          {connectionRequests[student._id] === 'connected' ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Connected
                            </>
                          ) : connectionRequests[student._id] === 'pending' ? (
                            <>
                              <Clock className="h-4 w-4 mr-2" />
                              Pending
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleMessage(student._id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Network;
