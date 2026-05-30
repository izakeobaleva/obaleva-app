import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ProfileHeader,
  ProfilePhoto,
  PersonalInfo,
  AppInfo,
  AboutSection,
  EditProfileForm,
  LogoutButton,
} from '../components/profile';

const COLORS = {
  vinho: '#800020',
  fundo: '#0f0f0f',
};

interface UserData {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
}

const DEFAULT_USER_DATA: UserData = {
  nome: 'João Silva',
  email: 'joao@email.com',
  cpf: '123.456.789-00',
  telefone: '(11) 99999-9999',
  dataNascimento: '15/05/1990',
  endereco: 'Rua Santo Antônio, 1095 - Centro, São Paulo - SP',
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    return localStorage.getItem('profileImage') || null;
  });
  
  const [userData, setUserData] = useState<UserData>(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : DEFAULT_USER_DATA;
  });
  
  const [editingSection, setEditingSection] = useState(false);
  const [editFormData, setEditFormData] = useState<UserData>(userData);

  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
  }, [profileImage]);

  const handleSaveEdit = () => {
    setUserData(editFormData);
    setEditingSection(false);
    alert('✅ Informações salvas com sucesso!');
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  if (editingSection) {
    return (
      <EditProfileForm
        formData={editFormData}
        onFormChange={setEditFormData}
        onSave={handleSaveEdit}
        onCancel={() => setEditingSection(false)}
      />
    );
  }

  return (
    <div style={{
      height: '100vh',
      width: '100%',
      backgroundColor: COLORS.fundo,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    }}>
      <ProfileHeader />

      <ProfilePhoto
        profileImage={profileImage}
        onPhotoChange={setProfileImage}
      />

      <PersonalInfo
        userData={userData}
        onEdit={() => {
          setEditFormData(userData);
          setEditingSection(true);
        }}
      />

      <AppInfo />
      <AboutSection />
      <LogoutButton onLogout={handleLogout} />

      <div style={{
        flexShrink: 0,
        padding: '0 16px 20px 16px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '9px', color: COLORS.vinho }}>
          obaleva.com.br/profile
        </span>
      </div>
    </div>
  );
};

export default ProfileScreen;