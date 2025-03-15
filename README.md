# Student_Alumni Interaction Platform

A comprehensive platform for facilitating interaction between students and alumni.

## Features

- User authentication with role-based access control (student, alumni, admin)
- Separate profile management for students and alumni
- Mentorship request system
- Job postings by alumni
- Events management
- Direct messaging between users

## Technical Details

### Profile Data Structure

The application now uses separate collections for student and alumni profiles:

- **StudentProfile**: Stores student-specific data like enrollment year, expected graduation year, major, minor, etc.
- **AlumniProfile**: Stores alumni-specific data like graduation year, work experience, industry, mentorship preferences, etc.
- **Profile**: Maintained for backward compatibility

### Migration

A migration script is provided to move existing profiles to the new collections:

```
node server/scripts/migrateProfiles.js
```

## Setup and Installation

1. Clone the repository
2. Install dependencies for both client and server:
   ```
   cd client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables in `.env` file
4. Run the server:
   ```
   cd server && npm start
   ```
5. Run the client:
   ```
   cd client && npm run dev
   ```

## API Endpoints

- `/api/auth`: Authentication routes
- `/api/users`: User management
- `/api/profile`: Profile management
- `/api/admin`: Admin functionality
- `/api/alumni`: Alumni-specific functionality

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT