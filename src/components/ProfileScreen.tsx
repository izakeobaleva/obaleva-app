import React from 'react';
import PassengerProfile from './PassengerProfile';
import DriverProfile from './DriverProfile';
import DriverRegistrationModal from '../DriverRegistrationModal';

interface ProfileScreenProps {
  user: any;
  profile: any;
  onLogout: () => void;
  onRefresh: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, profile, onLogout, onRefresh }) => {
  const [showDriverModal, setShowDriverModal] = React.useState(false);

  if (profile?.tipo === 'motorista') {
    return <DriverProfile user={user} onLogout={onLogout} />;
  }

  return (
    <>
      <PassengerProfile 
        user={user} 
        onLogout={onLogout} 
        onSejaMotorista={() => setShowDriverModal(true)} 
        onRefresh={onRefresh}
      />
      {showDriverModal && (
        <DriverRegistrationModal
          user={user}
          onClose={() => setShowDriverModal(false)}
          onSuccess={() => {
            setShowDriverModal(false);
            onRefresh();
          }}
        />
      )}
    </>
  );
};

export default ProfileScreen;