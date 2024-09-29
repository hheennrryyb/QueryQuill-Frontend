import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import LoadingSpinner from './loading-spinner';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading, isServerRunning } = useAuth();

  if (isLoading || isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isServerRunning) {
    return (
      <div className="flex items-center justify-center h-full text-2xl text-red-600">
        Server is not running. Please try again later.
      </div>
    );
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;