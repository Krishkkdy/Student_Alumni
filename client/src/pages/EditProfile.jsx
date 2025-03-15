import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { X, Plus, Save, UserIcon, FileText, Trash, Upload, GraduationCap, BookOpen, School, Briefcase } from 'lucide-react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { SKILLS_LIST, INTERESTS_LIST } from '../constants/profileConstants';

const EditProfile = () => {
  const { user, profile, updateProfile, profileType, isStudent, isAlumni } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const [interestSuggestions, setInterestSuggestions] = useState([]);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showInterestSuggestions, setShowInterestSuggestions] = useState(false);
  const skillInputRef = useRef(null);
  const interestInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');

  const [profileData, setProfileData] = useState({
    // Common fields
    fullName: '',
    email: '',
    username: '',
    bio: '',
    skills: [],
    interests: [],
    linkedinProfile: '',
    profileImage: '',
    coverImage: '',
    resume: '',
    
    // Student-specific fields
    enrollmentYear: '',
    expectedGraduationYear: '',
    major: '',
    minor: '',
    currentSemester: '',
    studentId: '',
    achievements: [],
    projects: [],
    
    // Alumni-specific fields
    graduationYear: '',
    degree: '',
    currentPosition: '',
    company: '',
    industry: '',
    workExperience: [],
    mentorshipAvailability: false,
    mentorshipAreas: []
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
      
      if (response.data) {
        // Update the profile in context
        updateProfile(response.data);
        
        // Update local state with profile data
        setProfileData(prevData => ({
          ...prevData,
          ...response.data
        }));
        
        // Set resume filename if it exists
        if (response.data.resume) {
          const filename = response.data.resume.split('/').pop();
          setResumeFileName(filename);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setMessage({
        text: 'Failed to load profile data. Please try again.',
        type: 'error'
      });
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
    const value = e.target.value;
    setNewSkill(value);
    
    if (value.trim()) {
      const filteredSuggestions = SKILLS_LIST.filter(skill =>
        skill.toLowerCase().startsWith(value.toLowerCase())
      );
      setSkillSuggestions(filteredSuggestions);
      setShowSkillSuggestions(true);
    } else {
      setSkillSuggestions([]);
      setShowSkillSuggestions(false);
    }
  };

  const handleInterestInputChange = (e) => {
    const value = e.target.value;
    setNewInterest(value);
    
    if (value.trim()) {
      const filteredSuggestions = INTERESTS_LIST.filter(interest =>
        interest.toLowerCase().startsWith(value.toLowerCase())
      );
      setInterestSuggestions(filteredSuggestions);
      setShowInterestSuggestions(true);
    } else {
      setInterestSuggestions([]);
      setShowInterestSuggestions(false);
    }
  };

  const selectSkill = (skill) => {
    if (!profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
    setShowSkillSuggestions(false);
    skillInputRef.current?.focus();
  };

  const removeSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const selectInterest = (interest) => {
    if (!profileData.interests.includes(interest)) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
    setNewInterest('');
    setShowInterestSuggestions(false);
    interestInputRef.current?.focus();
  };

  const removeInterest = (interestToRemove) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
        selectSkill(newSkill.trim());
      }
    }
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
        selectInterest(newInterest.trim());
      }
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeFileName(file.name);
      setProfileData(prev => ({ ...prev, resume: file.name }));
    }
  };

  const removeResume = () => {
    setResume(null);
    setResumeFileName('');
    setProfileData(prev => ({ ...prev, resume: '' }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create FormData object for file uploads
      const formData = new FormData();
      
      // Add common profile fields
      formData.append('fullName', profileData.fullName);
      formData.append('username', profileData.username);
      formData.append('bio', profileData.bio);
      formData.append('linkedinProfile', profileData.linkedinProfile);
      formData.append('skills', JSON.stringify(profileData.skills));
      formData.append('interests', JSON.stringify(profileData.interests));
      
      // Add role-specific fields
      if (isStudent) {
        formData.append('enrollmentYear', profileData.enrollmentYear || '');
        formData.append('expectedGraduationYear', profileData.expectedGraduationYear || '');
        formData.append('major', profileData.major || '');
        formData.append('minor', profileData.minor || '');
        formData.append('currentSemester', profileData.currentSemester || '');
        formData.append('studentId', profileData.studentId || '');
        formData.append('achievements', JSON.stringify(profileData.achievements || []));
        formData.append('projects', JSON.stringify(profileData.projects || []));
      } else if (isAlumni) {
        formData.append('graduationYear', profileData.graduationYear || '');
        formData.append('degree', profileData.degree || '');
        formData.append('currentPosition', profileData.currentPosition || '');
        formData.append('company', profileData.company || '');
        formData.append('industry', profileData.industry || '');
        formData.append('workExperience', JSON.stringify(profileData.workExperience || []));
        formData.append('mentorshipAvailability', profileData.mentorshipAvailability || false);
        formData.append('mentorshipAreas', JSON.stringify(profileData.mentorshipAreas || []));
      }
      
      // Add file uploads if they exist
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }
      
      if (resume) {
        formData.append('resume', resume);
      }
      
      // Send update request
      const response = await axios.put(
        `http://localhost:3000/api/profile/${user.email}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      if (response.data) {
        // Update profile in context
        updateProfile(response.data);
        
        setMessage({
          text: 'Profile updated successfully!',
          type: 'success'
        });
        
        // Redirect to profile page after short delay
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: error.response?.data?.message || 'Error updating profile. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to render student-specific form fields
  const renderStudentFields = () => {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">Academic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enrollment Year */}
          <div>
            <label htmlFor="enrollmentYear" className="block text-sm font-medium text-gray-700 mb-1">
              Enrollment Year
            </label>
            <input
              type="text"
              id="enrollmentYear"
              name="enrollmentYear"
              value={profileData.enrollmentYear || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2020"
            />
          </div>
          
          {/* Expected Graduation Year */}
          <div>
            <label htmlFor="expectedGraduationYear" className="block text-sm font-medium text-gray-700 mb-1">
              Expected Graduation Year
            </label>
            <input
              type="text"
              id="expectedGraduationYear"
              name="expectedGraduationYear"
              value={profileData.expectedGraduationYear || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2024"
            />
          </div>
          
          {/* Major */}
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
              Major
            </label>
            <input
              type="text"
              id="major"
              name="major"
              value={profileData.major || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Computer Science"
            />
          </div>
          
          {/* Minor */}
          <div>
            <label htmlFor="minor" className="block text-sm font-medium text-gray-700 mb-1">
              Minor (if applicable)
            </label>
            <input
              type="text"
              id="minor"
              name="minor"
              value={profileData.minor || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Mathematics"
            />
          </div>
          
          {/* Current Semester */}
          <div>
            <label htmlFor="currentSemester" className="block text-sm font-medium text-gray-700 mb-1">
              Current Semester
            </label>
            <input
              type="number"
              id="currentSemester"
              name="currentSemester"
              value={profileData.currentSemester || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 5"
              min="1"
              max="12"
            />
          </div>
          
          {/* Student ID */}
          <div>
            <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={profileData.studentId || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. S12345"
            />
          </div>
        </div>
        
        {/* Projects section would go here */}
        {/* Achievements section would go here */}
      </div>
    );
  };

  // Function to render alumni-specific form fields
  const renderAlumniFields = () => {
    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">Professional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Graduation Year */}
          <div>
            <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
              Graduation Year
            </label>
            <input
              type="text"
              id="graduationYear"
              name="graduationYear"
              value={profileData.graduationYear || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 2018"
            />
          </div>
          
          {/* Degree */}
          <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
              Degree
            </label>
            <input
              type="text"
              id="degree"
              name="degree"
              value={profileData.degree || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Bachelor of Science"
            />
          </div>
          
          {/* Major */}
          <div>
            <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">
              Major
            </label>
            <input
              type="text"
              id="major"
              name="major"
              value={profileData.major || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Computer Science"
            />
          </div>
          
          {/* Current Position */}
          <div>
            <label htmlFor="currentPosition" className="block text-sm font-medium text-gray-700 mb-1">
              Current Position
            </label>
            <input
              type="text"
              id="currentPosition"
              name="currentPosition"
              value={profileData.currentPosition || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Software Engineer"
            />
          </div>
          
          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={profileData.company || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Google"
            />
          </div>
          
          {/* Industry */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <input
              type="text"
              id="industry"
              name="industry"
              value={profileData.industry || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Technology"
            />
          </div>
        </div>
        
        {/* Mentorship Availability */}
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="mentorshipAvailability"
              name="mentorshipAvailability"
              checked={profileData.mentorshipAvailability || false}
              onChange={(e) => setProfileData({
                ...profileData,
                mentorshipAvailability: e.target.checked
              })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="mentorshipAvailability" className="ml-2 block text-sm text-gray-700">
              Available for mentorship
            </label>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Indicate if you're available to mentor current students
          </p>
        </div>
        
        {/* Work Experience section would go here */}
        {/* Mentorship Areas section would go here */}
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg shadow-lg flex items-center justify-between ${
              message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            <span className="flex items-center">
              {message.type === 'success' ? (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {message.text}
            </span>
            <button 
              onClick={() => setMessage({ text: '', type: '' })}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        <motion.form 
          onSubmit={handleSubmit} 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
              <div className="space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 text-white opacity-90 hover:opacity-100 transition-opacity flex items-center gap-2"
                >
                  <X size={18} />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Profile & Cover Image Section */}
            <div className="relative">
              <div className="h-48 bg-gray-100 rounded-xl overflow-hidden">
                {coverImage ? (
                  <img
                    src={URL.createObjectURL(coverImage)}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : profileData.coverImage ? (
                  <img
                    src={`http://localhost:3000${profileData.coverImage}`}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <PhotoIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-4 right-4 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                  <div className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50">
                    <Upload size={20} className="text-gray-600" />
                  </div>
                </label>
              </div>
              
              <div className="absolute -bottom-16 left-8">
                <div className="relative w-32 h-32">
                  <div className="w-full h-full rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                    {profileImage ? (
                      <img
                        src={URL.createObjectURL(profileImage)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : profileData.profileImage ? (
                      <img
                        src={`http://localhost:3000${profileData.profileImage}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="text-4xl font-bold text-gray-600 flex items-center justify-center h-full">${profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : '?'}</span>`;
                        }}
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-600 flex items-center justify-center h-full">
                        {profileData.fullName ? profileData.fullName.charAt(0).toUpperCase() : '?'}
                      </span>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                    <div className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50">
                      <Upload size={20} className="text-gray-600" />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Choose a username"
                />
              </div>

              <div className="col-span-2 md:col-span-1 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  name="linkedinProfile"
                  value={profileData.linkedinProfile}
                  onChange={handleInputChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your LinkedIn URL"
                />
              </div>

              <div className="col-span-2 space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {/* Skills Section */}
              <div className="col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                  {Array.isArray(profileData.skills) && profileData.skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-blue-200 transition-colors"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-600 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={handleSkillInputChange}
                      onKeyDown={handleSkillKeyDown}
                      ref={skillInputRef}
                      placeholder="Type a skill..."
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => selectSkill(newSkill)}
                      disabled={!newSkill.trim()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                  {showSkillSuggestions && skillSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      {skillSuggestions.map((skill, index) => (
                        <button
                          key={index}
                          onClick={() => selectSkill(skill)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
                        >
                          {skill}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Interests Section */}
              <div className="col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                  {Array.isArray(profileData.interests) && profileData.interests.map((interest, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 hover:bg-purple-200 transition-colors"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-purple-600 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  ))}
                </div>
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newInterest}
                      onChange={handleInterestInputChange}
                      onKeyDown={handleInterestKeyDown}
                      ref={interestInputRef}
                      placeholder="Type an interest..."
                      className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => selectInterest(newInterest)}
                      disabled={!newInterest.trim()}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                      Add
                    </button>
                  </div>
                  {showInterestSuggestions && interestSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto"
                    >
                      {interestSuggestions.map((interest, index) => (
                        <button
                          key={index}
                          onClick={() => selectInterest(interest)}
                          className="w-full text-left px-4 py-2 hover:bg-purple-50 focus:bg-purple-50 focus:outline-none transition-colors"
                        >
                          {interest}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Resume Section */}
              <div className="col-span-2 space-y-4">
                <label className="block text-sm font-medium text-gray-700">Resume</label>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-400" />
                      {(resume || resumeFileName) ? (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            {resume ? resume.name : resumeFileName}
                          </span>
                          <span className="text-xs text-gray-500">
                            PDF, DOC, or DOCX
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            No file selected
                          </span>
                          <span className="text-xs text-gray-500">
                            Upload your resume
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {(resume || resumeFileName) && (
                        <>
                          {!resume && resumeFileName && (
                            <a
                              href={`http://localhost:3000${profileData.resume}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              View
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={removeResume}
                            className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Remove
                          </button>
                        </>
                      )}
                      <label className="cursor-pointer bg-white text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                        />
                        Upload New
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student-specific fields */}
            {isStudent && renderStudentFields()}

            {/* Alumni-specific fields */}
            {isAlumni && renderAlumniFields()}
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default EditProfile;