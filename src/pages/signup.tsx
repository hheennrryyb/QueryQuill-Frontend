import { useState } from 'react';
import { createUser } from '../lib/actions';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast'
import { Link } from 'react-router-dom';
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
      <div className="px-8 py-6 mt-4 text-left bg-white md:shadow-lg md:rounded-lg w-full md:w-1/3">
        <h3 className="text-2xl font-bold text-center">Sign Up</h3>
        <form onSubmit={handleSubmit} className="mt-4">
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
          <div className='mt-4'>
            <label className="block" htmlFor="email">Email</label>
            <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700 bg-white"
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
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-gray-700 bg-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>
          <div className="flex items-center justify-start">
            <button className="btn btn-secondary px-6 py-2 mt-4 rounded-lg ">Sign Up</button>
          </div>
        </form>
        <div className="mt-4">
          Have an account already? <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
        </div>
        <div className="mt-4">
          By signing up, you agree to our:<br /> <Link to="/disclosure" className="text-blue-500 hover:text-blue-700">Data Privacy and File Upload Disclosure</Link>
        </div>
      </div>
    </div>

  );
};

export default Signup;