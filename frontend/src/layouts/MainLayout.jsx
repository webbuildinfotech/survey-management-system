import React, { useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";

import { GoHome } from "react-icons/go";
import { LuSquarePlus } from "react-icons/lu";
import { RiChatPollLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";

import { BsSearch } from "react-icons/bs";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import { RoutePaths } from "../routes/Path";

const MainLayout = () => {
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const location = useLocation();

  const locate = location.pathname === RoutePaths.PROFILE;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Main content area with sidebars */}
      <main className="flex flex-1">
        {/* Left Sidebar - Fixed on medium and up */}
        <div
          className={`hidden md:block fixed left-0 top-0 h-screen transition-all duration-300 ${
            isSidebarCollapsed ? "w-16 py-8 p-1" : "w-95 p-5"
          }  border-r-none`}
        >
          <LeftSidebar isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 mt-9 pb-16 md:pb-0 transition-all duration-300 ${
            isSidebarCollapsed ? "md:ml-16" : "md:ml-16 xl:ml-100"
          } xl:mr-100 max-xl:px-8 max-md:px-0`}
        >
          {locate && (
            <UserHeader
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
            />
          )}
          <Outlet />
        </div>

        {/* Right Sidebar - Fixed on medium and up, hidden on smaller screens */}
        <div
          className="hidden xl:block fixed right-0 top-0 h-screen p-5 overflow-y-auto min-[1279px]:max-[1330px]:w-90 min-[1331px]:w-100"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>
            {`
                div::-webkit-scrollbar {
                 display: none;
                }
              `}
          </style>
          <RightSidebar />
        </div>
      </main>

      {/* Bottom Navigation - Only on mobile */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-color-white rounded-t-3xl p-0 md:hidden z-50"> */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl px-0 py-1 z-50 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]"> */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl px-0 py-1 z-50 shadow-[0_-4px_30px_rgba(255,255,255,0.6),0_-2px_10px_rgba(0,0,0,0.1)] backdrop-black-md">
       */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl  md:hidden z-50 px-0 py-1 shadow-[0_-4px_15px_rgba(0,0,0,0.30)]">
        <nav className="flex justify-between">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "flex-1 flex flex-col items-center py-2 text-blue-500"
                : "flex-1 flex flex-col items-center py-2"
            }
          >
            <GoHome className="size-6" />
            <span className="text-sm">Home</span>
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? "flex-1 flex flex-col items-center py-2 text-blue-500"
                : "flex-1 flex flex-col items-center py-2"
            }
          >
            <BsSearch className="size-6" />
            <span className="text-sm">Search</span>
          </NavLink>
          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive
                ? "flex-1 flex flex-col items-center py-2 text-blue-500"
                : "flex-1 flex flex-col items-center py-2"
            }
          >
            <LuSquarePlus className="size-6" />
            <span className="text-sm">Create</span>
          </NavLink>
          <NavLink
            to="/answers"
            className={({ isActive }) =>
              isActive
                ? "flex-1 flex flex-col items-center py-2 text-blue-500"
                : "flex-1 flex flex-col items-center py-2"
            }
          >
            <RiChatPollLine className="size-6" />
            <span className="text-sm">Answers</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "flex-1 flex flex-col items-center py-2 text-blue-500"
                : "flex-1 flex flex-col items-center py-2"
            }
          >
            <HiOutlineUser className="size-6" />
            <span className="text-sm">Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;
