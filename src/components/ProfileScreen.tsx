import React from 'react';
import PassengerProfile from './PassengerProfile';
import DriverProfile from './DriverProfile';

interface ProfileScreenProps {
  user: any;
  profile: any;
  onLogout: () => void;
  onRefresh: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, profile, onLogout, onRefresh }) => {
  if (profile?.tipo === 'motorista') {
    return <DriverProfile user={user} onLogout={onLogout} />;
  }

  return (
    <>
      <PassengerProfile 
        user={user} 
        onLogout={onLogout} 
        onRefresh={onRefresh}
      />
    </>
  );
};

export default ProfileScreen;