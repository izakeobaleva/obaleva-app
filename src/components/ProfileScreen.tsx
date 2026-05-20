import React from 'react';
import PassengerProfile from './PassengerProfile';
import DriverProfile from './DriverProfile';
import DriverRegistrationModal from './DriverRegistrationModal';

interface ProfileScreenProps {
  user: any;
  profile: any;
  onLogout: () => void;
  onRefresh: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, profile, onLogout, onRefresh }) => {
  const [showDriverModal, setShowDriverModal] = React.useState(false);

  // Se for motorista, mostra painel do motorista
  if (profile?.tipo === 'motorista') {
    return <DriverProfile user={user} onLogout={onLogout} />;
  }

  // Se for passageiro, mostra painel do passageiro
  return (
    <>
      <PassengerProfile user={user} onLogout={onLogout} onSejaMotorista={() => setShowDriverModal(true)} />
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