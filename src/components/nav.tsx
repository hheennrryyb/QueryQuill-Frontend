import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';

const Nav: React.FC = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();

  return (
    <nav className="bg-gray-800 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link to="/projects" className="text-white hover:text-gray-300">Projects</Link>
        </li>
        <li>
          <Link to="/file-explorer" className="text-white hover:text-gray-300">File Explorer</Link>
        </li>
        <li>
          <Link to="/user" className="text-white hover:text-gray-300">User</Link>
        </li>
        {!isLoading && (
          isAuthenticated ? (
            <li>
              <button onClick={logout} className="text-white hover:text-gray-300">Logout</button>
            </li>
          ) : (
            <li>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

export default Nav;