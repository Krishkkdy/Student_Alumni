import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, Briefcase, Calendar, Mail, Linkedin, MapPin, Edit2, X, FileText, Download, Eye, GraduationCap, BookOpen, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SKILLS_LIST, INTERESTS_LIST } from '../constants/profileConstants';

const Profile = () => {
  const { user, profile, updateProfile, profileType, isStudent, isAlumni } = useUser();
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

  const [isProfileImageModalOpen, setIsProfileImageModalOpen] = useState(false); // State for modal

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

  const handleViewResume = () => {
    if (profileData.resume) {
      window.open(`http://localhost:3000${profileData.resume}`, '_blank');
    }
  };

  // Function to render student-specific information
  const renderStudentInfo = () => {
  return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">Academic Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.enrollmentYear && (
            <div className="flex items-center">
              <Calendar className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Enrollment Year</p>
                <p>{profileData.enrollmentYear}</p>
              </div>
            </div>
          )}
          
          {profileData.expectedGraduationYear && (
            <div className="flex items-center">
              <GraduationCap className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Expected Graduation</p>
                <p>{profileData.expectedGraduationYear}</p>
              </div>
            </div>
          )}
          
          {profileData.major && (
            <div className="flex items-center">
              <BookOpen className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Major</p>
                <p>{profileData.major}</p>
              </div>
            </div>
          )}
          
          {profileData.minor && (
            <div className="flex items-center">
              <BookOpen className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Minor</p>
                <p>{profileData.minor}</p>
              </div>
            </div>
          )}
          
          {profileData.currentSemester && (
            <div className="flex items-center">
              <School className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Current Semester</p>
                <p>{profileData.currentSemester}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Projects Section */}
        {profileData.projects && profileData.projects.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3 text-blue-600">Projects</h4>
            <div className="space-y-4">
              {profileData.projects.map((project, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h5 className="font-semibold">{project.title}</h5>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  {project.technologies && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm mt-1 inline-block hover:underline"
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Achievements Section */}
        {profileData.achievements && profileData.achievements.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3 text-blue-600">Achievements</h4>
            <div className="space-y-4">
              {profileData.achievements.map((achievement, index) => (
                <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                  <h5 className="font-semibold">{achievement.title}</h5>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  {achievement.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Function to render alumni-specific information
  const renderAlumniInfo = () => {
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">Professional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData.graduationYear && (
            <div className="flex items-center">
              <GraduationCap className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Graduation Year</p>
                <p>{profileData.graduationYear}</p>
              </div>
            </div>
          )}
          
          {profileData.degree && (
            <div className="flex items-center">
              <School className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Degree</p>
                <p>{profileData.degree}</p>
              </div>
            </div>
          )}
          
          {profileData.currentPosition && (
            <div className="flex items-center">
              <Briefcase className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Current Position</p>
                <p>{profileData.currentPosition}</p>
              </div>
            </div>
          )}
          
          {profileData.company && (
            <div className="flex items-center">
              <Briefcase className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p>{profileData.company}</p>
              </div>
            </div>
          )}
          
          {profileData.industry && (
            <div className="flex items-center">
              <Briefcase className="text-gray-500 mr-2" size={18} />
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p>{profileData.industry}</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Work Experience Section */}
        {profileData.workExperience && profileData.workExperience.length > 0 && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-3 text-blue-600">Work Experience</h4>
            <div className="space-y-4">
              {profileData.workExperience.map((experience, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  <h5 className="font-semibold">{experience.title}</h5>
                  <p className="text-sm font-medium">{experience.company}</p>
                  {experience.location && (
                    <p className="text-sm text-gray-600">{experience.location}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {experience.from && new Date(experience.from).toLocaleDateString()} - 
                    {experience.current ? ' Present' : experience.to && new Date(experience.to).toLocaleDateString()}
                  </p>
                  {experience.description && (
                    <p className="text-sm text-gray-600 mt-2">{experience.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Mentorship Section */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-3 text-blue-600">Mentorship</h4>
          <p className="text-sm text-gray-600">
            {profileData.mentorshipAvailability 
              ? 'Available for mentorship' 
              : 'Not currently available for mentorship'}
          </p>
          
          {profileData.mentorshipAvailability && profileData.mentorshipAreas && profileData.mentorshipAreas.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Mentorship Areas:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profileData.mentorshipAreas.map((area, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
              {/* Cover Image */}
      <div className="relative h-64 bg-blue-600">
              {profileData.coverImage ? (
                <img
                  src={`http://localhost:3000${profileData.coverImage}`}
                  alt="Cover"
            className="w-full h-full object-cover"
                />
              ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-blue-700"></div>
        )}
      </div>

      {/* Profile Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row">
              {/* Profile Image */}
              <div className="relative mb-4 md:mb-0">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white bg-gray-200">
                  {profileData.profileImage ? (
                    <img
                      src={`http://localhost:3000${profileData.profileImage}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Camera size={32} className="text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="md:ml-6 flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <h1 className="text-2xl font-bold">{profileData.fullName}</h1>
              <button
                onClick={() => navigate('/edit-profile')}
                    className="mt-2 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                    <Edit2 size={16} className="mr-2" />
                Edit Profile
              </button>
            </div>

                <p className="text-gray-600 mt-1">
                  {isStudent ? 'Student' : isAlumni ? 'Alumni' : profileData.role || 'User'}
                </p>
                
                {/* Contact & Basic Info */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <Mail className="text-gray-500 mr-2" size={18} />
                    <span>{profileData.email}</span>
              </div>
                  
                    {profileData.linkedinProfile && (
                    <div className="flex items-center">
                      <Linkedin className="text-gray-500 mr-2" size={18} />
                      <a 
                        href={profileData.linkedinProfile.startsWith('http') ? profileData.linkedinProfile : `https://${profileData.linkedinProfile}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
                </div>
              </div>
              
            {/* Bio */}
            {profileData.bio && (
                <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-700">{profileData.bio}</p>
                </div>
              )}

            {/* Skills & Interests */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills && profileData.skills.length > 0 ? (
                    profileData.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No skills added yet</p>
                  )}
                </div>
              </div>
              
              {/* Interests */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.interests && profileData.interests.length > 0 ? (
                    profileData.interests.map((interest, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No interests added yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Resume */}
            {profileData.resume && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Resume</h3>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={handleViewResume}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    <Eye size={16} className="mr-1" />
                    View
                  </button>
                  <button 
                    onClick={handleDownloadResume}
                    className="inline-flex items-center px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    <Download size={16} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Role-specific information */}
        {isStudent && renderStudentInfo()}
        {isAlumni && renderAlumniInfo()}
      </div>
    </div>
  );
};

export default Profile;