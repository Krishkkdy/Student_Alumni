import React from 'react';
import { GraduationCap, School, Briefcase, Building, Award, Users, Calendar } from 'lucide-react';

const ExperienceCard = ({ experience }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Building className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div className="ml-4">
        <h3 className="font-semibold text-lg text-gray-900">{experience.title}</h3>
        <p className="text-gray-600">{experience.company}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(experience.startDate).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
          {' - '}
          {experience.endDate
            ? new Date(experience.endDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })
            : 'Present'}
        </p>
        <p className="mt-4 text-gray-700">{experience.description}</p>
        {experience.achievements && (
          <ul className="mt-4 space-y-2">
            {experience.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start">
                <Award className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                <span className="text-gray-700">{achievement}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

const MentorshipCard = ({ mentorship }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-purple-500">
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="p-3 bg-purple-50 rounded-lg">
          <Users className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      <div className="ml-4">
        <h3 className="font-semibold text-lg text-gray-900">{mentorship.title}</h3>
        <p className="text-gray-600">{mentorship.mentee}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(mentorship.startDate).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
          {' - '}
          {mentorship.endDate
            ? new Date(mentorship.endDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })
            : 'Present'}
        </p>
        <p className="mt-4 text-gray-700">{mentorship.description}</p>
      </div>
    </div>
  </div>
);

const AlumniProfile = ({ profileData }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Education Information */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profileData.graduationYear && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Graduation Year</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.graduationYear}</p>
              </div>
            </div>
          )}

          {profileData.degree && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-green-50 rounded-lg">
                  <School className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Degree</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.degree}</p>
              </div>
            </div>
          )}

          {profileData.industry && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Industry</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.industry}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Experience Section */}
      {profileData.workExperience && profileData.workExperience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
          <div className="space-y-6">
            {profileData.workExperience.map((experience, index) => (
              <ExperienceCard key={index} experience={experience} />
            ))}
          </div>
        </div>
      )}

      {/* Mentorship Section */}
      {profileData.mentorshipAreas && profileData.mentorshipAreas.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mentorship</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.mentorshipAreas.map((area, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700">
                  {profileData.mentorshipAvailability ? 'Available for Mentorship' : 'Not Available for Mentorship'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Past Mentorships */}
      {profileData.pastMentorships && profileData.pastMentorships.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Mentorships</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.pastMentorships.map((mentorship, index) => (
              <MentorshipCard key={index} mentorship={mentorship} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniProfile; 