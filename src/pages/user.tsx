import React from 'react';
import { useProfile } from '../contexts/profile-context';
import { useAuth } from '../contexts/auth-context';
import LoadingSpinner from '../components/loading-spinner';
const User: React.FC = () => {
  const { profile } = useProfile();
  const { logout } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      {profile ? (
        <div>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
      ) : (
        <p><LoadingSpinner /></p>
      )}
      <button
        onClick={logout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default User;