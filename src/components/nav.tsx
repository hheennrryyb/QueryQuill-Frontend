import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { LibraryBig, LogIn, LogOut, User, Home, Menu, X } from 'lucide-react';

const Nav: React.FC = () => {
  const { isAuthenticated, logout, isLoading } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsExpanded(false);
  }, [location]);

  return (
    <>
    {/* Mobile Nav */}
     <div
       className={`sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
         isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
       }`}
       onClick={() => setIsExpanded(false)}
     ></div>
     <nav className="sm:hidden bg-secondary text-white p-3 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center text-white">
          <img src="/QueryQuillLogoHorizontal.png" alt="Logo" className="h-10 mr-2" />
          {/* <span className="font-bold text-lg">QueryQuill</span> */}
        </Link>
        <button
          className="bg-transparent transition-opacity duration-200 p-0 m-0"
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? <X size={30} className='text-white' /> : <Menu size={30} className='text-white' />}
        </button>
      </div>
      <div className={`nav-menu ${isExpanded ? 'expanded' : ''}`}>
        <ul className="flex flex-col mt-4 ml-1">
          <li className="mb-4 nav-item">
            <Link to="/" className="flex items-center text-white">
              <Home size={24} className="mr-2" />
              Home
            </Link>
          </li>
          <li className="mb-4 nav-item">
            <Link to="/projects" className="flex items-center text-white">
              <LibraryBig size={24} className="mr-2" />
              Projects
            </Link>
          </li>
          <li className="mb-4 nav-item">
            <Link to="/user" className="flex items-center text-white">
              <User size={24} className="mr-2" />
              User
            </Link>
          </li>
          {!isLoading && (
            isAuthenticated ? (
              <li className="nav-item mb-4 mt-4">
                <button onClick={logout} className="flex items-center text-white bg-transparent p-0" >
                  <LogOut size={24} className="mr-2" />
                  Logout
                </button>
              </li>
            ) : (
              <li className="nav-item mb-4 mt-4">
                <Link to="/login" className="flex items-center text-white bg-transparent p-0">
                  <LogIn size={24} className="mr-2" />
                  Login
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </nav>
    {/* Desktop Nav */}
    <nav 
      className="hidden sm:block min-h-[400px] max-h-[50vh] bg-secondary text-white transition-all duration-300 ease-in-out overflow-hidden rounded-[28px] backdrop-filter backdrop-blur-md shadow-md "
      style={{ width: isExpanded ? '160px' : '60px' }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <ul className="flex flex-col pt-1 w-full h-full">
      <li className='mt-4 mb-8'>
        <Link to="/" className="flex items-center pl-[10px] relative">
          <img src={'/full_icon.png'} alt="logo" className={`w-10 h-10 absolute duration-1000 transform ${isExpanded ? 'rotate-[-360deg]' : 'rotate-0'}`} />
          <span className={`text-white ml-12 transition-opacity duration-300 font-bold ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>QueryQuill</span>
        </Link>
      </li>
        <li className="mb-6 ">
          <Link to="/" className="flex items-center px-4 relative">
            <Home size={24} className='text-white absolute' />
            <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Home</span>
          </Link>
        </li>
        <li className="mb-6">
          <Link to="/projects" className="flex items-center px-4 relative">
            <LibraryBig size={24} className='text-white absolute' />
            <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Projects</span>
          </Link>
        </li>
        <li className="mb-6">
          <Link to="/user" className="flex items-center px-4 relative">
            <User size={24} className='text-white absolute' />
            <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>User</span>
          </Link>
        </li>
        <div className="mt-auto">
          {!isLoading && (
            isAuthenticated ? (
              <li>
                <button onClick={logout} className="flex items-center px-4 w-full relative bg-black p-3 rounded-none pb-4">
                  <LogOut size={24} className='text-white absolute' />
                  <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Logout</span>
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login" className="flex items-center px-4 relative bg-black p-3 rounded-none pb-4">
                  <LogIn size={24} className='text-white absolute' />
                  <span className={`text-white ml-8 transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>Login</span>
                </Link>
              </li>
            )
          )}
        </div>
      </ul>
    </nav>
    </>
  );
};

export default Nav;
