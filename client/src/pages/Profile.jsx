import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    graduationYear: '',
    currentPosition: '',
    company: '',
    linkedinProfile: '',
    bio: '',
    skills: [],
    interests: []
  });

  useEffect(() => {
    if (user) {
      // Initialize with user data
      setProfileData(prevData => ({
        ...prevData,
        fullName: user.name || '',
        email: user.email || ''
      }));
      // Fetch additional profile data
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/api/profile/${user.email}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setProfileData(prev => ({ ...prev, ...response.data }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 404) {
        // No profile found is okay for new users
        return;
      }
      setMessage({ 
        text: error.response?.data?.message || 'Error fetching profile data', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setProfileData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleInterestChange = (e) => {
    const interests = e.target.value.split(',').map(interest => interest.trim()).filter(Boolean);
    setProfileData(prev => ({
      ...prev,
      interests
    }));
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'graduationYear'];
    const missingFields = requiredFields.filter(field => !profileData[field]);
    
    if (missingFields.length > 0) {
      setMessage({
        text: `Please fill in the following required fields: ${missingFields.join(', ')}`,
        type: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:3000/api/profile/${user.email}`,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      setProfileData(response.data);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error updating profile', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.fullName) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        {message.text && (
          <div 
            className={`mb-4 p-3 rounded ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-400' 
                : 'bg-red-100 text-red-700 border border-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">My Profile</h2>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) {
                // Reset form when canceling
                fetchProfileData();
              }
            }}
            className={`px-4 py-2 text-sm rounded-md ${
              isEditing 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    disabled
                    className="w-full p-2 border rounded bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">
                    Graduation Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="graduationYear"
                    value={profileData.graduationYear}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows="4"
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                    placeholder={isEditing ? "Tell us about yourself..." : ""}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-600 mb-1">Current Position</label>
                  <input
                    type="text"
                    name="currentPosition"
                    value={profileData.currentPosition}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    name="linkedinProfile"
                    value={profileData.linkedinProfile}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                    placeholder={isEditing ? "https://linkedin.com/in/your-profile" : ""}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={profileData.skills.join(', ')}
                    onChange={handleSkillChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                    placeholder={isEditing ? "e.g., JavaScript, React, Node.js" : ""}
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">Interests (comma-separated)</label>
                  <input
                    type="text"
                    name="interests"
                    value={profileData.interests.join(', ')}
                    onChange={handleInterestChange}
                    disabled={!isEditing}
                    className={`w-full p-2 border rounded ${
                      isEditing 
                        ? 'focus:ring-2 focus:ring-blue-400' 
                        : 'bg-gray-50'
                    }`}
                    placeholder={isEditing ? "e.g., Web Development, AI, Cloud Computing" : ""}
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile; 