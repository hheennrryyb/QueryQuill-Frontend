import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import LoadingSpinner from './loading-spinner';
import { AlertTriangle, RefreshCw } from 'lucide-react'; // Import icons

const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading, isServerRunning, checkAuthStatus } = useAuth();
  const [showServerError, setShowServerError] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      checkAuthStatus();
    }

    const timer = setTimeout(() => {
      setShowServerError(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, checkAuthStatus]);

  if (!isServerRunning && showServerError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Server Connection Issue</h2>
        <p className="text-lg mb-4">We're having trouble connecting to our servers.</p>
        <p className="text-md mb-6">This could be due to maintenance or high traffic. Please try again in a few moments.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary flex items-center px-4 py-2  text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Refresh Page
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;