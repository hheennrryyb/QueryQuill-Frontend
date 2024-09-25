import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import LoadingSpinner from './loading-spinner';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading, isServerRunning } = useAuth();

  if (isLoading) {
    return <div><LoadingSpinner /></div>;
  } else if (!isServerRunning) {
    return <div className='flex items-center justify-center h-full text-2xl'>Server is not running. Please try again later.</div>;
  } else if (isAuthenticated === null) {
    return <div><LoadingSpinner /></div>;
  } else if (isAuthenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;