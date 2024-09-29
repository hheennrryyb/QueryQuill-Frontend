import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import LoadingSpinner from './loading-spinner';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading, isServerRunning } = useAuth();

  // If authentication status is known and user is not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If server is not running, show error message
  if (!isServerRunning) {
    return (
      <div className="flex items-center justify-center h-full text-2xl">
        Server is not running. Please try again later.
      </div>
    );
  }

  // If still loading and not yet authenticated, show loading spinner
  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;