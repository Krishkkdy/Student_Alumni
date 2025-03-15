import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileType, setProfileType] = useState(null); // 'student' or 'alumni'

  useEffect(() => {
    // Load user data from localStorage on initial render
    const userData = localStorage.getItem('user');
    const profileData = localStorage.getItem('profile');
    const profileTypeData = localStorage.getItem('profileType');
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Loaded user from localStorage:', parsedUser);
        setUser(parsedUser);
        
        if (profileData) {
          const parsedProfile = JSON.parse(profileData);
          setProfile(parsedProfile);
        }
        
        if (profileTypeData) {
          setProfileType(profileTypeData);
        } else if (parsedUser && parsedUser.role) {
          // Set profile type based on user role if not explicitly stored
          setProfileType(parsedUser.role === 'alumni' ? 'alumni' : 'student');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const updateUser = (userData) => {
    console.log('Updating user data:', userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update profile type based on user role
      if (userData.role) {
        const newProfileType = userData.role === 'alumni' ? 'alumni' : 'student';
        localStorage.setItem('profileType', newProfileType);
        setProfileType(newProfileType);
      }
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('profile');
      localStorage.removeItem('profileType');
      setProfile(null);
      setProfileType(null);
    }
    setUser(userData);
  };
  
  const updateProfile = (profileData) => {
    console.log('Updating profile data:', profileData);
    if (profileData) {
      localStorage.setItem('profile', JSON.stringify(profileData));
    } else {
      localStorage.removeItem('profile');
    }
    setProfile(profileData);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      updateUser, 
      profile, 
      updateProfile, 
      profileType, 
      isStudent: profileType === 'student',
      isAlumni: profileType === 'alumni'
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 