import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast'

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.promise(
      login(username, password),
      {
        loading: 'Logging in...',
        success: () => {
          navigate('/projects');
          return 'Login successful';
        },
        error: (error) => error.message,
      }
    ).then(() => {
    }).catch((error) => {
      toast.error('Error logging in: ' + error.response.data.error);
    });
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100 ">
      <div className="px-8 py-6 mt-4 text-left bg-white md:shadow-lg md:rounded-lg  w-full md:w-1/3">
        <h3 className="text-2xl font-bold text-center">Login</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700 bg-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="btn btn-secondary px-6 py-2 mt-4 rounded-lg ">Login</button>
            </div>
          </div>
        </form>
      <div className='mt-4'>
        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
      </div>
      </div>
    </div>
  );
};

export default Login;