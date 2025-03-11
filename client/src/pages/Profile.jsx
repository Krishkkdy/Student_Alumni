import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, Briefcase, Calendar, Mail, Linkedin, MapPin, Edit2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SKILLS_LIST, INTERESTS_LIST } from '../constants/profileConstants';

const Profile = () => {
  const { user } = useUser();
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
    interests: [],
    profileImage: '',
    coverImage: ''
  });

  const navigate = useNavigate();

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          >
            My Profile
          </motion.h1>
          <p className="text-gray-600 mt-2">Showcase your professional journey</p>
        </div>
        
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 mb-6 rounded-lg shadow-lg flex items-center justify-between
              ${message.type === 'success' ? 'bg-green-50 text-green-800 border-l-4 border-green-500' : 
              'bg-red-50 text-red-800 border-l-4 border-red-500'}`}
          >
            <span>{message.text}</span>
            <button 
              onClick={() => setMessage({ text: '', type: '' })}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
              <div className="absolute -bottom-16 left-8">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-600">
                    {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate('/edit-profile')}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>
            
            <div className="pt-20 px-8 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{profileData.fullName || '-'}</h2>
                  <p className="text-gray-600 mt-1">@{profileData.username || '-'}</p>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-gray-600">
                      <Mail size={18} className="mr-2" />
                      {profileData.email}
                    </div>
                    {profileData.graduationYear && (
                      <div className="flex items-center text-gray-600">
                        <Calendar size={18} className="mr-2" />
                        Class of {profileData.graduationYear}
                      </div>
                    )}
                    {profileData.currentPosition && (
                      <div className="flex items-center text-gray-600">
                        <Briefcase size={18} className="mr-2" />
                        {profileData.currentPosition} {profileData.company && `at ${profileData.company}`}
                      </div>
                    )}
                    {profileData.linkedinProfile && (
                      <a 
                        href={profileData.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                      >
                        <Linkedin size={18} className="mr-2" />
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
                
                <div>
                  {profileData.bio && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-700 mb-2">About</h3>
                      <p className="text-gray-600">{profileData.bio}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </motion.span>
                    ))
                  ) : <p className="text-gray-500">No skills added yet</p>}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests && profileData.interests.length > 0 ? (
                    profileData.interests.map((interest, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </motion.span>
                    ))
                  ) : <p className="text-gray-500">No interests added yet</p>}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;