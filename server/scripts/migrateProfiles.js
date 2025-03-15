/**
 * Migration script to move existing profiles to separate StudentProfile and AlumniProfile collections
 * 
 * Run this script with: node scripts/migrateProfiles.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const Profile = require('../models/Profile');
const StudentProfile = require('../models/StudentProfile');
const AlumniProfile = require('../models/AlumniProfile');

// Connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student_alumni');
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    return false;
  }
};

// Migrate profiles
const migrateProfiles = async () => {
  try {
    // Get all existing profiles
    const profiles = await Profile.find({});
    console.log(`Found ${profiles.length} profiles to migrate`);

    let studentCount = 0;
    let alumniCount = 0;
    let errorCount = 0;

    // Process each profile
    for (const profile of profiles) {
      try {
        // Check if profile already exists in new collections
        const existingStudentProfile = await StudentProfile.findOne({ user: profile.user });
        const existingAlumniProfile = await AlumniProfile.findOne({ user: profile.user });

        if (profile.role === 'alumni' && !existingAlumniProfile) {
          // Create alumni profile
          const alumniProfile = new AlumniProfile({
            user: profile.user,
            username: profile.username,
            fullName: profile.fullName,
            email: profile.email,
            graduationYear: profile.graduationYear || '',
            currentPosition: profile.currentPosition || '',
            company: profile.company || '',
            linkedinProfile: profile.linkedinProfile || '',
            bio: profile.bio || '',
            skills: profile.skills || [],
            interests: profile.interests || [],
            profileImage: profile.profileImage,
            coverImage: profile.coverImage,
            resume: profile.resume
          });

          await alumniProfile.save();
          alumniCount++;
          console.log(`Migrated alumni profile for ${profile.email}`);
        } else if (profile.role === 'student' && !existingStudentProfile) {
          // Create student profile
          const studentProfile = new StudentProfile({
            user: profile.user,
            username: profile.username,
            fullName: profile.fullName,
            email: profile.email,
            expectedGraduationYear: profile.graduationYear || '',
            linkedinProfile: profile.linkedinProfile || '',
            bio: profile.bio || '',
            skills: profile.skills || [],
            interests: profile.interests || [],
            profileImage: profile.profileImage,
            coverImage: profile.coverImage,
            resume: profile.resume
          });

          await studentProfile.save();
          studentCount++;
          console.log(`Migrated student profile for ${profile.email}`);
        } else if (!existingStudentProfile && !existingAlumniProfile) {
          // Default to student profile if role is not specified
          const studentProfile = new StudentProfile({
            user: profile.user,
            username: profile.username,
            fullName: profile.fullName,
            email: profile.email,
            expectedGraduationYear: profile.graduationYear || '',
            linkedinProfile: profile.linkedinProfile || '',
            bio: profile.bio || '',
            skills: profile.skills || [],
            interests: profile.interests || [],
            profileImage: profile.profileImage,
            coverImage: profile.coverImage,
            resume: profile.resume
          });

          await studentProfile.save();
          studentCount++;
          console.log(`Migrated default student profile for ${profile.email}`);
        } else {
          console.log(`Profile for ${profile.email} already exists in new collections, skipping`);
        }
      } catch (error) {
        console.error(`Error migrating profile for ${profile.email}:`, error);
        errorCount++;
      }
    }

    console.log('Migration completed:');
    console.log(`- ${studentCount} student profiles created`);
    console.log(`- ${alumniCount} alumni profiles created`);
    console.log(`- ${errorCount} errors encountered`);

  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    // Close MongoDB connection
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the migration
(async () => {
  const connected = await connectToMongoDB();
  if (connected) {
    await migrateProfiles();
  }
})(); 