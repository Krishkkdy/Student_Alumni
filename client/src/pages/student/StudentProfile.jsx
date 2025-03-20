import React from 'react';
import { Calendar, GraduationCap, BookOpen, School, Link as LinkIcon } from 'lucide-react';

const ProjectCard = ({ project }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
    <h3 className="font-semibold text-lg text-gray-900">{project.title}</h3>
    <p className="mt-2 text-gray-600">{project.description}</p>
    {project.technologies && (
      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((tech, index) => (
          <span
            key={index}
            className="px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
          >
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
        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-700"
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        View Project
      </a>
    )}
  </div>
);

const AchievementCard = ({ achievement }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border-l-4 border-green-500">
    <h3 className="font-semibold text-lg text-gray-900">{achievement.title}</h3>
    <p className="mt-2 text-gray-600">{achievement.description}</p>
    {achievement.date && (
      <p className="mt-4 text-sm text-gray-500">
        {new Date(achievement.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </p>
    )}
  </div>
);

const StudentProfile = ({ profileData }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Academic Information */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {profileData.enrollmentYear && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Enrollment Year</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.enrollmentYear}</p>
              </div>
            </div>
          )}

          {profileData.expectedGraduationYear && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-green-50 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Expected Graduation</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.expectedGraduationYear}</p>
              </div>
            </div>
          )}

          {profileData.major && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Major</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.major}</p>
              </div>
            </div>
          )}

          {profileData.minor && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-pink-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-pink-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Minor</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.minor}</p>
              </div>
            </div>
          )}

          {profileData.currentSemester && (
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <School className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Current Semester</h3>
                <p className="mt-1 text-lg font-medium text-gray-900">{profileData.currentSemester}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Projects Section */}
      {profileData.projects && profileData.projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Achievements Section */}
      {profileData.achievements && profileData.achievements.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.achievements.map((achievement, index) => (
              <AchievementCard key={index} achievement={achievement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile; 