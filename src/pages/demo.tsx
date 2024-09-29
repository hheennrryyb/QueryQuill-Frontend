import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import axiosInstance from '../lib/axios-instance';
import toast from 'react-hot-toast';
import { Loader } from 'lucide-react';

const COOLDOWN_PERIOD = 0 * 60 * 1000; // 10 minutes in milliseconds

const Demo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [displayText, setDisplayText] = useState(<p>Please wait while we activate your demo environment. <br /> This process is automatic and will take a couple of minutes.</p>);

  useEffect(() => {
    const activateDemo = async () => {
      const lastDemoActivation = localStorage.getItem('lastDemoActivation');
      const currentTime = Date.now();

      if (lastDemoActivation && currentTime - parseInt(lastDemoActivation) < COOLDOWN_PERIOD) {
        const remainingTime = Math.ceil((COOLDOWN_PERIOD - (currentTime - parseInt(lastDemoActivation))) / 60000);
        setDisplayText(<p>Please wait {remainingTime} minutes before activating demo mode again. <br />  Navigating back to home...</p>);
        setTimeout(() => {
          navigate('/');
        }, 3000);
        return;
      }

      try {
        const response = await axiosInstance.post('/demo/');
        const { username, password } = response.data;

        // Log in the user with the provided credentials
        await login(username, password);

        // Show success message
        toast.success('Demo mode activated successfully!');

        // Set the last activation time
        localStorage.setItem('lastDemoActivation', currentTime.toString());

        // Navigate to the projects page
        navigate('/projects');
      } catch (error) {
        console.error('Error activating demo mode:', error);
        toast.error('Failed to activate demo mode. Please try again.');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    activateDemo();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className='flex flex-col gap-2 items-center'>
              <Loader size={32} className="animate-spin" />
              <h1 className="text-2xl font-bold mb-4">Activating Demo Mode</h1>
          </div>
          <p>{displayText}</p>
        </div>
      </div>
    );
  }

  return null; // The component will navigate away before rendering anything else
};

export default Demo;
