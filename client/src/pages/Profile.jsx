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
    username: '',
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
        email: user.email || '',
        username: user.username || ''
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
    const requiredFields = ['fullName', 'username'];
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

    const profilePayload = {
      user_id: user._id,
      username: profileData.username,
      fullName: profileData.fullName,
      email: profileData.email,
      graduationYear: profileData.graduationYear,
      currentPosition: profileData.currentPosition,
      company: profileData.company,
      linkedinProfile: profileData.linkedinProfile,
      bio: profileData.bio,
      skills: profileData.skills,
      interests: profileData.interests
    };

    try {
      setLoading(true);
      let response;
      
      // Check if we're creating or updating
      if (profileData._id) {
        response = await axios.put(
          `http://localhost:3000/api/profile/${profileData.email}`,
          profilePayload,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } else {
        response = await axios.post(
          'http://localhost:3000/api/profile',
          profilePayload,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      }
      
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

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center">
          <p>Loading profile data...</p>
        </div>
      ) : (
        <>
          {!isEditing ? (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 font-medium">Username</p>
                  <p className="text-gray-800">{profileData.username || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Full Name</p>
                  <p className="text-gray-800">{profileData.fullName || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Email</p>
                  <p className="text-gray-800">{profileData.email || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Graduation Year</p>
                  <p className="text-gray-800">{profileData.graduationYear || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Current Position</p>
                  <p className="text-gray-800">{profileData.currentPosition || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Company</p>
                  <p className="text-gray-800">{profileData.company || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">LinkedIn Profile</p>
                  <p className="text-gray-800">
                    {profileData.linkedinProfile ? (
                      <a 
                        href={profileData.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Profile
                      </a>
                    ) : '-'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-gray-600 font-medium">Bio</p>
                <p className="text-gray-800">{profileData.bio || '-'}</p>
              </div>
              
              <div className="mt-6">
                <p className="text-gray-600 font-medium">Skills</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : <p className="text-gray-800">-</p>}
                </div>
              </div>
              
              <div className="mt-6">
                <p className="text-gray-600 font-medium">Interests</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profileData.interests && profileData.interests.length > 0 ? (
                    profileData.interests.map((interest, index) => (
                      <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))
                  ) : <p className="text-gray-800">-</p>}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="username" className="block text-gray-700 font-medium mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>
                <div>
                  <label htmlFor="graduationYear" className="block text-gray-700 font-medium mb-1">
                    Graduation Year
                  </label>
                  <input
                    type="text"
                    id="graduationYear"
                    name="graduationYear"
                    value={profileData.graduationYear}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. 2023"
                  />
                </div>
                <div>
                  <label htmlFor="currentPosition" className="block text-gray-700 font-medium mb-1">
                    Current Position
                  </label>
                  <input
                    type="text"
                    id="currentPosition"
                    name="currentPosition"
                    value={profileData.currentPosition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-gray-700 font-medium mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={profileData.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Tech Company Inc."
                  />
                </div>
                <div>
                  <label htmlFor="linkedinProfile" className="block text-gray-700 font-medium mb-1">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={profileData.linkedinProfile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="bio" className="block text-gray-700 font-medium mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
              
              <div className="mt-6">
                <label htmlFor="skills" className="block text-gray-700 font-medium mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={profileData.skills.join(', ')}
                  onChange={handleSkillChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. React, JavaScript, Node.js"
                />
                <p className="text-sm text-gray-500 mt-1">Separate skills with commas</p>
              </div>
              
              <div className="mt-6">
                <label htmlFor="interests" className="block text-gray-700 font-medium mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={profileData.interests.join(', ')}
                  onChange={handleInterestChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Blockchain, AI, Machine Learning"
                />
                <p className="text-sm text-gray-500 mt-1">Separate interests with commas</p>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded font-medium"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;