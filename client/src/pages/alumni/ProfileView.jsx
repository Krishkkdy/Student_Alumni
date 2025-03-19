import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProfileView = () => {
    const { id } = useParams(); // Get the user ID from the URL
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

                const response = await axios.get(`http://localhost:3000/api/alumni/profile/${id}`, {
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
    }, [id]);

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
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                {/* Basic Information */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Username</p>
                            <p className="text-lg text-gray-800">{profile.username || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-lg text-gray-800">{profile.fullName || 'N/A'}</p>
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

                {/* Current Position */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Position</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Current Position</p>
                            <p className="text-lg text-gray-800">{profile.currentPosition || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Company</p>
                            <p className="text-lg text-gray-800">{profile.company || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Industry</p>
                            <p className="text-lg text-gray-800">{profile.industry || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                {/* Work Experience */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Work Experience</h2>
                    {profile.workExperience && profile.workExperience.length > 0 ? (
                        profile.workExperience.map((exp, index) => (
                            <div key={index} className="mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Title</p>
                                        <p className="text-lg text-gray-800">{exp.title || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Company</p>
                                        <p className="text-lg text-gray-800">{exp.company || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="text-lg text-gray-800">{exp.location || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">From</p>
                                        <p className="text-lg text-gray-800">{exp.from ? new Date(exp.from).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">To</p>
                                        <p className="text-lg text-gray-800">
                                            {exp.current ? 'Present' : exp.to ? new Date(exp.to).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Description</p>
                                        <p className="text-lg text-gray-800">{exp.description || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No work experience available.</p>
                    )}
                </div>

                {/* Mentorship Preferences */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mentorship Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Skills and Interests */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Skills and Interests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Skills</p>
                            <p className="text-lg text-gray-800">
                                {profile.skills && profile.skills.length > 0
                                    ? profile.skills.join(', ')
                                    : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Interests</p>
                            <p className="text-lg text-gray-800">
                                {profile.interests && profile.interests.length > 0
                                    ? profile.interests.join(', ')
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact Preferences */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Preferences</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Bio */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bio</h2>
                    <p className="text-lg text-gray-800">{profile.bio || 'No bio available.'}</p>
                </div>

                {/* Profile and Cover Images */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Images</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Profile Image</p>
                            {profile.profileImage ? (
                                <img
                                    src={profile.profileImage}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover"
                                />
                            ) : (
                                <p className="text-gray-500">No profile image available.</p>
                            )}
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Cover Image</p>
                            {profile.coverImage ? (
                                <img
                                    src={profile.coverImage}
                                    alt="Cover"
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                            ) : (
                                <p className="text-gray-500">No cover image available.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* LinkedIn Profile and Resume */}
                <div className="mb-8">
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