//LeftSidebar.jsx

import React from "react";
import { Link } from "react-router-dom";
import { RoutePaths } from "../../routes/Path";
import { GoHome } from "react-icons/go";
import { MdSearch } from "react-icons/md";
import { LuBell, LuSquarePlus } from "react-icons/lu";
import { RiChatPollLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import { LiaCogSolid } from "react-icons/lia";
import { FiMenu } from "react-icons/fi";

const LeftSidebar = ({ isCollapsed, onCreateClick }) => {
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
      name: "Notifications",
      path: "/notifications",
      icon: <LuBell className="size-8" />,
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
    // For Figma
    <>
      <div className="flex items-center bg-white gap-6 xl:flex-1 p-4">
        <FiMenu className="xl:hidden cursor-pointer size-10 mt-1" />
        <div className="xl:ml-30 text-3xl font-bold text-primary">Griterr</div>
      </div>

      <div
        className={`w-14  ${!isCollapsed ? "xl:w-100" : ""} flex flex-col ${
          !isCollapsed ? "xl:pl-3 p-4" : ""
        } pb-10 ${!isCollapsed ? "" : "p-0"} h-full min-h-screen bg-white`}
      >
        <nav className="mt-20 xl:ml-30">
          <ul className="flex flex-col items-center xl:items-start">
            {navItems.map((item) => (
              <li key={item.name} className="mb-4">
                {item.name === "Create" ? (
                  <button
                    type="button"
                    className={`flex items-center justify-center xl:justify-start px-2 py-2 rounded-lg transition-colors ${
                      currentPath === item.path
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                    onClick={onCreateClick}
                  >
                    <span className={!isCollapsed ? "xl:mr-4" : ""}>
                      {item.icon}
                    </span>
                    <span
                      className={`${
                        isCollapsed ? "hidden" : "hidden xl:block"
                      } text-xl font-medium`}
                    >
                      {item.name}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className={`flex items-center justify-center xl:justify-start px-2 py-2 rounded-lg transition-colors ${
                      currentPath === item.path
                        ? "text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    <span className={!isCollapsed ? "xl:mr-4" : ""}>
                      {item.icon}
                    </span>
                    <span
                      className={`${
                        isCollapsed ? "hidden" : "hidden xl:block"
                      } text-xl font-medium`}
                    >
                      {item.name}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* <div className="mb-2">
        <Link
          to="/settings"
          className="flex items-center text-gray-700 hover:text-blue-600 px-2 py-2 rounded-lg"
        >
          <span className={!isCollapsed ? "xl:mr-4" : ""}>
            <LiaCogSolid className="size-8" />
          </span>
          <span
            className={`${
              isCollapsed ? "hidden" : "hidden xl:block"
            } text-2xl font-medium`}
          >
            Settings
          </span>
        </Link>
      </div> */}
      </div>
    </>
  );
};

export default LeftSidebar;
