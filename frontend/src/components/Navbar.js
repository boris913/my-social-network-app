import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UserIcon,  MoonIcon, SunIcon, MagnifyingGlassIcon, PencilSquareIcon, BellIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ThemeContext from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user } = useAuth(); 
  const [isCollapsed, setIsCollapsed] = useState(false);

  

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className={`pt-10 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white h-screen fixed p-2 border-r border-gray-400 dark:border-gray-1000 transition-all duration-300 ${isCollapsed ? 'w-45' : 'w-64'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="h-8 w-8 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
          {!isCollapsed && <h1 className="text-2xl font-bold">My App</h1>}
        </div>
        <button
          onClick={toggleNavbar}
          className="p-1 bg-blue-600 hover:bg-blue-800 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle Navbar"
        >
          {isCollapsed ? <ChevronRightIcon className="h-5 w-5" /> : <ChevronLeftIcon className="h-5 w-5" />}
        </button>
      </div>
      <ul className="flex flex-col space-y-4">
        <li className="flex items-center font-bold">
          <Link to="/" className="flex items-center hover:no-underline">
            <HomeIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Home'}
          </Link>
        </li>
        <li className="flex items-center font-bold">
          <Link to={`/profile/${user.id}`} className="flex items-center hover:no-underline">
            <UserIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Profile'}
          </Link>
        </li>
        {/* <li className="flex items-center font-bold">
          <Link to="/login" className="flex items-center hover:no-underline">
            <LockClosedIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Login'}
          </Link>
        </li>
        <li className="flex items-center font-bold">
          <Link to="/register" className="flex items-center hover:no-underline">
            <UserPlusIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Register'}
          </Link>
        </li> */}
        <li className="flex items-center font-bold">
          <Link to="/search" className="flex items-center hover:no-underline">
            <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Search'}
          </Link>
        </li>
        <li className="flex items-center font-bold">
          <Link to="/newtweet" className="flex items-center hover:no-underline">
            <PencilSquareIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'New Tweet'}
          </Link>
        </li>
        <li className="flex items-center font-bold">
          <Link to="/notifications" className="flex items-center hover:no-underline">
            <BellIcon className="h-6 w-6 mr-2" />
            {!isCollapsed && 'Notifications'}
          </Link>
        </li>
        <li className="flex items-center mt-4 font-bold">
          <button onClick={toggleTheme} className="flex items-center hover:no-underline">
            {theme === 'light' ? (
              <>
                <MoonIcon className="h-6 w-6 mr-2" />
                {!isCollapsed && 'Dark Mode'}
              </>
            ) : (
              <>
                <SunIcon className="h-6 w-6 mr-2" />
                {!isCollapsed && 'Light Mode'}
              </>
            )}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;