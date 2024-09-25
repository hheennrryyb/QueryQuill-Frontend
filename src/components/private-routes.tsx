import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import LoadingSpinner from './loading-spinner';

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading, isServerRunning } = useAuth();
  
  if (isLoading) {
    return <div><LoadingSpinner /></div>;
  }
  
  if (!isServerRunning) {
    return <div className='flex items-center justify-center h-full text-2xl'>Server is not running. Please try again later.</div>;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;