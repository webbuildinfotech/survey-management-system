//LeftSidebar.jsx 

import React from "react";
import { Link } from "react-router-dom";
import { RoutePaths } from "../../routes/Path";
import { GoHome } from "react-icons/go";
import { MdSearch } from "react-icons/md";
import { LuSquarePlus } from "react-icons/lu";
import { RiChatPollLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import { LiaCogSolid } from "react-icons/lia";

const LeftSidebar = ({ isCollapsed }) => {
  const navItems = [
    {
      name: "Home",
      path: RoutePaths.HOME,
      icon: <GoHome className="size-8" />,
    },
    {
      name: "Search",
      path: "/search",
      icon: <MdSearch className="size-8" />,
    },
    {
      name: "Create",
      path: "/create",
      icon: <LuSquarePlus className="size-8" />,
    },
    {
      name: "Answers",
      path: "/answers",
      icon: <RiChatPollLine className="size-8" />,
    },
    {
      name: "Profile",
      path: RoutePaths.PROFILE,
      icon: <HiOutlineUser className="size-8" />,
    },
  ];

  // Get current path for active state
  const currentPath = window.location.pathname;

  return (
    <div className={`w-16 ${!isCollapsed ? 'xl:w-100' : ''} flex flex-col ${
      !isCollapsed ? 'xl:pl-32 py-12' : ''
    } pb-10 ${!isCollapsed ? 'p-4' : 'p-0' } h-full min-h-screen justify-between`}>
      <div>
        <div className={`text-3xl font-bold text-primary mb-20 ${
          isCollapsed ? 'hidden' : 'hidden xl:block'
        }`}>
          Griterr
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="mb-4">
                <Link
                  to={item.path}
                  className={`flex items-center px-2 py-2 rounded-lg transition-colors ${
                    currentPath === item.path
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  <span className={!isCollapsed ? 'xl:mr-4' : ''}>{item.icon}</span>
                  <span className={`${
                    isCollapsed ? 'hidden' : 'hidden xl:block'
                  } text-2xl font-medium`}>{item.name}</span>
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
          <span className={!isCollapsed ? 'xl:mr-4' : ''}>
            <LiaCogSolid className="size-8" />
          </span>
          <span className={`${
            isCollapsed ? 'hidden' : 'hidden xl:block'
          } text-2xl font-medium`}>Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default LeftSidebar;
