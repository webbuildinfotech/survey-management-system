import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import { NavLink } from "react-router-dom";
import {
  HiHome,
  HiSearch,
  HiPlusCircle,
  HiChatAlt2,
  HiUser,
  HiArrowNarrowLeft,
  HiBell,
} from "react-icons/hi";
// import Header from "../components/Header.jsx"; // Commented out as per image
// import Footer from "../components/Footer.jsx"; // Commented out as per image

// import RightSidebar from "../components/RightSidebar";
// import BottomNav from "../components/BottomNav";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Optional Header could go here if you need a top bar */}
      <div className="sticky top-0 z-30 bg-white h-10 flex items-center">
        {/* Mobile: left arrow and bell */}
        <div className="flex w-full md:hidden justify-between px-4">
          <HiArrowNarrowLeft className="text-2xl cursor-pointer" />
          <span className="font-medium text-md">@themohanreviews</span>
          <HiBell className="text-2xl cursor-pointer" />
        </div>
        {/* Desktop: centered username */}
        <div className="hidden md:flex w-full justify-center">
          <div className="flex items-center">
            <HiArrowNarrowLeft className="text-2xl cursor-pointer" />
            <span className="ml-2 font-medium text-md">@themohanreviews</span>
          </div>
        </div>
      </div>
      {/* Main content area with sidebars */}
      <main className="flex flex-1">
        {/* Left Sidebar - Fixed position on medium screens and up */}
        <div className="hidden md:block fixed left-0 top-0 h-screen w-100 p-5 border-r-none">
          <LeftSidebar />
        </div>

        {/* Main Content Area - With margin to account for fixed sidebars */}
        <div className="flex-1 pb-16 md:pb-0 md:ml-100 md:mr-100">
          <Outlet />
        </div>

        {/* Right Sidebar - Fixed position on medium screens and up */}
        <div className="hidden md:block fixed right-0 top-0 h-screen w-100 p-5 border-l-none overflow-y-auto">
          <RightSidebar />
        </div>
      </main>

      {/* Bottom Navigation - Visible on small screens, hidden on medium screens and up */}
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

      {/* Optional Footer could go here if needed below the main content */}
    </div>
  );
};

export default MainLayout;
