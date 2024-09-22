import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

const Logout: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  setTimeout(() => {
    handleLogout();
  }, 1000);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  )
}

export default Logout;