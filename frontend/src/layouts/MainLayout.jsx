import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import { MdNavigateBefore } from "react-icons/md";

import {
  HiHome,
  HiSearch,
  HiPlusCircle,
  HiChatAlt2,
  HiUser,
} from "react-icons/hi";
import { LuBell } from "react-icons/lu";
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <div className="sticky top-0 z-30 bg-white h-10 flex items-center md:hidden py-8">
        <ul className="flex w-full justify-between items-center list-none px-4">
          <li className="cursor-pointer">
            <MdNavigateBefore size={40} />
          </li>
          <li className="font-medium text-md">@themohanreviews</li>
          <li className="text-2xl cursor-pointer">
            <LuBell />
          </li>
        </ul>
      </div>

      {/* Main content area with sidebars */}
      <main className="flex flex-1">
        {/* Left Sidebar - Fixed on medium and up */}
        <div className="hidden md:block fixed left-0 top-0 h-screen w-16 xl:w-95 p-5 border-r-none">
          <LeftSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 pb-16 md:pb-0 md:ml-16 xl:ml-100 xl:mr-100 max-xl:px-8">
          {/* Desktop Header (moved here) */}
          <div className="hidden md:flex w-full justify-start pb-2 bg-white">
            <div className="flex items-center">
              <MdNavigateBefore className="cursor-pointer" size={40} />
              <span className="ml-2 font-medium text-md">@themohanreviews</span>
            </div>
          </div>

          {/* Routed Page Content */}
          <Outlet />
        </div>

        {/* Right Sidebar - Fixed on medium and up, hidden on smaller screens */}
        <div
          className="hidden xl:block fixed right-0 top-0 h-screen w-95 p-5 overflow-y-auto"
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-0 md:hidden z-50">
        <nav className="flex justify-between">
          <NavLink to="/" className="flex-1 flex flex-col items-center py-2">
            <HiHome className="text-2xl" />
            <span className="text-xs">Home</span>
          </NavLink>
          <NavLink
            to="/search"
            className="flex-1 flex flex-col items-center py-2"
          >
            <HiSearch className="text-2xl" />
            <span className="text-xs">Search</span>
          </NavLink>
          <NavLink
            to="/create"
            className="flex-1 flex flex-col items-center py-2"
          >
            <HiPlusCircle className="text-2xl" />
            <span className="text-xs">Create</span>
          </NavLink>
          <NavLink
            to="/answers"
            className="flex-1 flex flex-col items-center py-2"
          >
            <HiChatAlt2 className="text-2xl" />
            <span className="text-xs">Answers</span>
          </NavLink>
          <NavLink
            to="/profile"
            className="flex-1 flex flex-col items-center py-2"
          >
            <HiUser className="text-2xl" />
            <span className="text-xs">Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default MainLayout;
