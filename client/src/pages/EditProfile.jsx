import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { X, Plus, Save, UserIcon, FileText, Trash, Upload } from 'lucide-react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { SKILLS_LIST, INTERESTS_LIST } from '../constants/profileConstants';

const EditProfile = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const skillInputRef = useRef(null);
  const interestInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [resume, setResume] = useState(null);

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
    interests: [],
    resume: '',
    profileImage: '',
    coverImage: ''
  });

  useEffect(() => {
    if (user) {
      setProfileData(prevData => ({
        ...prevData,
        fullName: user.name || '',
        email: user.email || '',
        username: user.username || ''
      }));
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

  const handleSkillInputChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleInterestInputChange = (e) => {
    setNewInterest(e.target.value);
  };

  const addSkill = () => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setNewSkill('');
      skillInputRef.current?.focus();
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addInterest = () => {
    if (newInterest && !profileData.interests.includes(newInterest)) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest]
      }));
      setNewInterest('');
      interestInputRef.current?.focus();
    }
  };

  const removeInterest = (interestToRemove) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setProfileData(prev => ({ ...prev, resume: file.name }));
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileData(prev => ({ ...prev, profileImage: file.name }));
    }
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setProfileData(prev => ({ ...prev, coverImage: file.name }));
    }
  };

  const removeResume = () => {
    setResume(null);
    setProfileData(prev => ({ ...prev, resume: '' }));
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileData(prev => ({ ...prev, profileImage: '' }));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setProfileData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();

    // Append all profile data to FormData
    Object.keys(profileData).forEach((key) => {
      if (key === 'skills' || key === 'interests') {
        // Handle arrays (skills and interests)
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    });

    // Append files (resume, profileImage, coverImage)
    if (resume) {
      formData.append('resume', resume);
    }
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/profile/${user.email}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data', // Ensure the correct content type
          },
        }
      );

      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: error.response?.data?.message || 'Error updating profile',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto">
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
            <div className="space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>

          {/* Profile Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Profile Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative h-24 w-24">
                {profileImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(profileImage)}
                      alt="Profile Preview"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cover Image
            </label>
            <div className="space-y-4">
              <div className="relative h-48 w-full">
                {coverImage ? (
                  <>
                    <img
                      src={URL.createObjectURL(coverImage)}
                      alt="Cover Preview"
                      className="h-48 w-full rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeCoverImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <div className="h-48 w-full rounded-lg bg-gray-200 flex items-center justify-center">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Graduation Year
              </label>
              <input
                type="text"
                name="graduationYear"
                value={profileData.graduationYear}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Position
              </label>
              <input
                type="text"
                name="currentPosition"
                value={profileData.currentPosition}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <input
                type="text"
                name="company"
                value={profileData.company}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                name="linkedinProfile"
                value={profileData.linkedinProfile}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newSkill}
                onChange={handleSkillInputChange}
                ref={skillInputRef}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a skill</option>
                {SKILLS_LIST.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="hover:text-purple-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <select
                value={newInterest}
                onChange={handleInterestInputChange}
                ref={interestInputRef}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an interest</option>
                {INTERESTS_LIST.map((interest) => (
                  <option key={interest} value={interest}>
                    {interest}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addInterest}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Add
              </button>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resume</label>
            <div className="flex items-center space-x-4">
              {resume ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{resume.name}</span>
                  <button type="button" onClick={removeResume} className="text-red-600 hover:text-red-800">
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="h-6 w-6 text-gray-400" />
                  <span className="text-sm text-gray-500">No file selected</span>
                </div>
              )}
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default EditProfile;