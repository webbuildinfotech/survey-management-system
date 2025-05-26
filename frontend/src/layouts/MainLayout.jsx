import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import { MdNavigateBefore } from "react-icons/md";

import { GoHome } from "react-icons/go";
import { MdSearch } from "react-icons/md";
import { LuSquarePlus } from "react-icons/lu";
import { RiChatPollLine } from "react-icons/ri";
import { HiOutlineUser } from "react-icons/hi";
import { FiMenu } from "react-icons/fi";
import { LuBell } from "react-icons/lu";

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
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
          className={`flex-1 pb-16 md:pb-0 transition-all duration-300 ${
            isSidebarCollapsed ? "md:ml-16" : "md:ml-16 xl:ml-100"
          } xl:mr-100 max-xl:px-8 max-md:px-0`}
        >
          {/* Mobile Header */}

          {/* For Static position header */}
          {/* <div className="md:hidden flex justify-between items-center p-4 bg-white"> */}

          {/* For fixed position header */}
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white shadow-md">
            <div className="flex items-center">
              <FiMenu className="cursor-pointer size-8" />
              <div className="ml-4 text-3xl font-bold text-primary">
                Griterr
              </div>
            </div>
            <span className="cursor-pointer size-6">
              <LuBell className="size-6" />
            </span>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex w-full justify-start pb-2 bg-white">
            <div className="flex items-center">
              <MdNavigateBefore
                className="cursor-pointer size-8"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />
              <span className="ml-2 font-medium text-base">
                @themohanreviews
              </span>
            </div>
          </div>

          {/* Routed Page Content */}
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
      <div className="fixed bottom-0 left-0 right-0 bg-[#FFFFFF] rounded-t-2xl p-0 md:hidden z-50">
        <nav className="flex justify-between shadow-2xl border-t-0 border-t-black">
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
            <MdSearch className="size-6" />
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
