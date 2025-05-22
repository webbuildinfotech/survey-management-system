// frontend/src/components/LeftSidebar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../routes/Path';

// Heroicons from react-icons
import { 
  HiHome, 
  HiSearch, 
  HiPlusCircle, 
  HiChatAlt2, 
  HiUser, 
  HiCog 
} from 'react-icons/hi';

const LeftSidebar = () => {
  const navItems = [
    { name: 'Home', path: RoutePaths.HOME, icon: <HiHome className="text-2xl" /> },
    { name: 'Search', path: '/search', icon: <HiSearch className="text-2xl" /> },
    { name: 'Create', path: '/create', icon: <HiPlusCircle className="text-2xl" /> },
    { name: 'Answers', path: '/answers', icon: <HiChatAlt2 className="text-2xl" /> },
    { name: 'Profile', path: RoutePaths.PROFILE, icon: <HiUser className="text-2xl" /> },
  ];

  // Get current path for active state
  const currentPath = window.location.pathname;

  return (
    <div className="w-64 flex flex-col p-4 h-full min-h-screen justify-between">
      <div>
        <div className="text-3xl font-bold text-blue-500 mb-10">Griterr</div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-4">
                <Link
                  to={item.path}
                  className={`flex items-center px-2 py-2 rounded-lg transition-colors ${
                    currentPath === item.path
                      ? "text-blue-600 font-semibold bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <span className="mr-4">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mb-2">
        <Link
          to="/settings"
          className="flex items-center text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg"
        >
          <span className="mr-4"><HiCog className="text-2xl" /></span>
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
