import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfileView = () => {
    const { type, id } = useParams(); // Get the type (alumni/student) and ID from the URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. Please log in.');
                }

                const apiUrl = type === 'alumni'
                    ? `http://localhost:3000/api/alumni/profile/${id}`
                    : `http://localhost:3000/api/student/profile/${id}`;

                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProfile(response.data.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProfile();
    }, [type, id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return <div>No profile data found.</div>;
    }

    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                        {/* Profile Image */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {profile.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Profile Info */}
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">{profile.fullName || 'N/A'}</h1>
                            <p className="text-lg text-gray-600 mb-4">{profile.currentPosition || 'N/A'} at {profile.company || 'N/A'}</p>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {profile.skills?.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="text-lg text-gray-800">{profile.username || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-lg text-gray-800">{profile.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Graduation Year</p>
                                    <p className="text-lg text-gray-800">{profile.graduationYear || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Degree</p>
                                    <p className="text-lg text-gray-800">{profile.degree || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Major</p>
                                    <p className="text-lg text-gray-800">{profile.major || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Preferences */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Preferences</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Allow Direct Messages</p>
                                    <p className="text-lg text-gray-800">
                                        {profile.contactPreferences?.allowDirectMessage ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Allow Email Contact</p>
                                    <p className="text-lg text-gray-800">
                                        {profile.contactPreferences?.allowEmailContact ? 'Yes' : 'No'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Preferred Contact Method</p>
                                    <p className="text-lg text-gray-800">
                                        {profile.contactPreferences?.preferredContactMethod || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Work Experience */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Work Experience</h2>
                            {profile.workExperience && profile.workExperience.length > 0 ? (
                                profile.workExperience.map((exp, index) => (
                                    <div key={index} className="mb-6">
                                        <div className="space-y-2">
                                            <p className="text-lg font-medium text-gray-800">{exp.title || 'N/A'}</p>
                                            <p className="text-sm text-gray-600">{exp.company || 'N/A'}</p>
                                            <p className="text-sm text-gray-500">
                                                {exp.from ? new Date(exp.from).toLocaleDateString() : 'N/A'} -{' '}
                                                {exp.current ? 'Present' : exp.to ? new Date(exp.to).toLocaleDateString() : 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-500">{exp.location || 'N/A'}</p>
                                            <p className="text-sm text-gray-700">{exp.description || 'N/A'}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No work experience available.</p>
                            )}
                        </div>

                        {/* Mentorship Preferences */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mentorship Preferences</h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Mentorship Availability</p>
                                    <p className="text-lg text-gray-800">
                                        {profile.mentorshipAvailability ? 'Available' : 'Not Available'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Mentorship Areas</p>
                                    <p className="text-lg text-gray-800">
                                        {profile.mentorshipAreas && profile.mentorshipAreas.length > 0
                                            ? profile.mentorshipAreas.join(', ')
                                            : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bio Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bio</h2>
                    <p className="text-lg text-gray-800">{profile.bio || 'No bio available.'}</p>
                </div>

                {/* LinkedIn Profile and Resume */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">LinkedIn Profile</p>
                            <p className="text-lg text-gray-800">
                                {profile.linkedinProfile ? (
                                    <a
                                        href={profile.linkedinProfile}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        {profile.linkedinProfile}
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Resume</p>
                            <p className="text-lg text-gray-800">
                                {profile.resume ? (
                                    <a
                                        href={profile.resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        Download Resume
                                    </a>
                                ) : (
                                    'N/A'
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;