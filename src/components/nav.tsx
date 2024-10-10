import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { LibraryBig, LogIn, LogOut, User, Home } from 'lucide-react';

const Nav: React.FC = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <nav 
      className="min-h-[400px] max-h-[50vh] bg-white bg-opacity-10 text-white transition-all duration-300 ease-in-out overflow-hidden rounded-xl backdrop-filter backdrop-blur-md shadow-md"
      style={{ width: isExpanded ? '150px' : '60px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul className="flex flex-col py-0 w-full h-full">
        <li className="mb-8 mt-4">
          <Link to="/" className="flex items-center px-4 relative">
            <Home size={24} className='text-white absolute' />
            <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Home</span>
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/projects" className="flex items-center px-4 relative">
            <LibraryBig size={24} className='text-white absolute' />
            <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Projects</span>
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/user" className="flex items-center px-4 relative">
            <User size={24} className='text-white absolute' />
            <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>User</span>
          </Link>
        </li>
        <div className="mt-auto">
          {!isLoading && (
            isAuthenticated ? (
              <li>
                <button onClick={logout} className="flex items-center px-4 w-full relative">
                  <LogOut size={24} className='text-white absolute' />
                  <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Logout</span>
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="flex items-center px-4 relative">
                  <LogIn size={24} className='text-white absolute' />
                  <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Login</span>
                </Link>
              </li>
            )
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Nav;