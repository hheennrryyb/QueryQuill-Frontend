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
    login(username, password).then(() => {
      navigate('/projects');
    }).catch((error) => {
      toast.error('Error logging in: ' + error.response.data.error);
      console.error('Login failed:', error);
    });
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Login to your account</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="username">Username</label>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-white"
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
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600  text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button className="btn btn-primary px-6 py-2 mt-4 text-white  rounded-lg ">Login</button>
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