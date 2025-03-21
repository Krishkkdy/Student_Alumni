import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from './ProfileHeader';
import StudentProfile from './student/StudentProfile';
import AlumniProfile from './alumni/AlumniProfile';

const Profile = () => {
  const { user, profile, updateProfile, isStudent, isAlumni } = useUser();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [profileData, setProfileData] = useState({
    // Common fields
    fullName: '',
    email: '',
    username: '',
    bio: '',
    skills: [],
    interests: [],
    profileImage: '',
    coverImage: '',
    resume: '',
    linkedinProfile: '',
    location: '',
    
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
    mentorshipAreas: [],
    pastMentorships: []
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
      
      if (response.data) {
        updateProfile(response.data);
        setProfileData(prevData => ({
          ...prevData,
          ...response.data
        }));
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

  const handleViewResume = () => {
    if (profileData.resume) {
      window.open(`http://localhost:3000${profileData.resume}`, '_blank');
    }
  };

  const handleDownloadResume = () => {
    if (profileData.resume) {
      const link = document.createElement('a');
      link.href = `http://localhost:3000${profileData.resume}`;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (message.type === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
          <p>{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader
        profileData={profileData}
        onEditProfile={handleEditProfile}
        handleViewResume={handleViewResume}
        handleDownloadResume={handleDownloadResume}
      />
      
      {isStudent && <StudentProfile profileData={profileData} />}
      {isAlumni && <AlumniProfile profileData={profileData} />}
    </div>
  );
};

export default Profile;