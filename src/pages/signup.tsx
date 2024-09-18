import { useState } from 'react';
import { createUser } from '../lib/actions';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createUser(username, password, email)
      .then((response) => {
        console.log('User created:', response.data);
        toast.success('User created successfully, Redirecting to login page');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      })
      .catch((error) => {
        toast.error('Error creating user: ' + error.response.data.error);
        console.error('Error creating user:', error);
      });
  };

  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Sign Up</h3>
        <form onSubmit={handleSubmit} className="mt-4">
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
          <div className='mt-4'>
            <label className="block" htmlFor="email">Email</label>
            <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>
          <div className="mt-4">
            <label className="block" htmlFor="password">Password</label>
            <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <div className="flex items-center justify-center">
            <button className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700">Sign Up</button>
          </div>
        </form>
      </div>
    </div>

  );
};

export default Signup;