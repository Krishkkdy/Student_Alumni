import React from 'react';
import { Camera, Mail, Linkedin, MapPin, Edit2, FileText, Download, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ profileData, onEditProfile, handleViewResume, handleDownloadResume }) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-blue-500 to-indigo-600 relative rounded-b-3xl overflow-hidden">
        {profileData.coverImage ? (
          <img
            src={`http://localhost:3000${profileData.coverImage}`}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNGM3LjczMiAwIDE0IDYuMjY4IDE0IDE0cy02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50"></div>
        )}
        <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50">
          <Camera className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-32">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div className="sm:flex sm:space-x-5">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="relative">
                    <img
                      className="h-32 w-32 rounded-xl bg-white p-1 shadow-lg object-cover"
                      src={profileData.profileImage ? `http://localhost:3000${profileData.profileImage}` : 'https://via.placeholder.com/128'}
                      alt={profileData.fullName}
                    />
                    <button className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow-lg hover:bg-gray-50">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="mt-4 sm:mt-0 sm:pt-1 sm:text-left">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{profileData.fullName}</h1>
                    <button
                      onClick={onEditProfile}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-lg text-gray-500">{profileData.currentPosition || profileData.major}</p>
                  
                  {/* Contact & Location */}
                  <div className="mt-4 flex flex-wrap gap-4">
                    {profileData.email && (
                      <a href={`mailto:${profileData.email}`} className="flex items-center text-gray-500 hover:text-gray-700">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{profileData.email}</span>
                      </a>
                    )}
                    {profileData.location && (
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{profileData.location}</span>
                      </div>
                    )}
                    {profileData.linkedinProfile && (
                      <a
                        href={profileData.linkedinProfile}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-500 hover:text-blue-600"
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-3">
                {profileData.resume && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleViewResume}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Resume
                    </button>
                    <button
                      onClick={handleDownloadResume}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                )}
                <Link
                  to="/edit-profile"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Update Resume
                </Link>
              </div>
            </div>

            {/* Bio */}
            {profileData.bio && (
              <div className="mt-6 text-gray-700 space-y-6">
                <p className="text-base">{profileData.bio}</p>
              </div>
            )}

            {/* Skills & Interests */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {profileData.skills && profileData.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profileData.interests && profileData.interests.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 