import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import Header from "../components/Header";
import { RoutePaths } from "../routes/Path";
import BottomNavigation from "./BottomNavigation";
import CreatePost from "../components/DialogBox/CreatePost";
import { LuBell } from "react-icons/lu";
import { FiMenu } from "react-icons/fi";

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation();
  const locate = location.pathname === RoutePaths.SEARCH;

  // Get page title based on current pathname
  const getPageTitle = () => {
    const pathname = location.pathname;

    if (pathname === RoutePaths.SEARCH) {
      return "Search";
    } else if (pathname === RoutePaths.PROFILE) {
      return "Profile";
    } else if (pathname === RoutePaths.CREATE) {
      return "Create";
    } else if (pathname === RoutePaths.NOTIFICATION) {
      return "Notification";
    } else {
      return "Home Feed";
    }
  };
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Fixed */}
      <div className="hidden md:block fixed left-0 top-0 h-full bg-white">
        <LeftSidebar
          isCollapsed={isSidebarCollapsed}
          onCreateClick={() => setShowCreateDialog(true)}
        />
      </div>

      {/* Main Content Area with Header - Add left margin to account for fixed sidebar */}
      <div className="flex-1 flex flex-col md:ml-16 xl:ml-100">
        {/* Header - Only for main content and right sidebar */}
        <div className="flex items-center justify-between bg-white   w-full"></div>

        {/* Content and Right Sidebar Container */}
        <div className="flex flex-1 relative">
          {/* --- Overlay and Dialog --- */}
          {showCreateDialog && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto">
              {/* Overlay covers only main + right sidebar */}
              <div className="absolute inset-0 bg-opacity-30"></div>
              {/* Dialog */}
              <div className="relative z-10">
                <CreatePost
                  open={showCreateDialog}
                  onClose={() => setShowCreateDialog(false)}
                />
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 bg-gray-100 xl:mr-100   ">
            <div>
              <div className="flex items-center justify-between bg-white p-5 sticky top-0 z-20 w-full">
                {/* Position 1: Desktop Page Title, Mobile: Hidden */}
                <span className="hidden xl:block text-lg font-semibold">
                  {getPageTitle()}
                </span>

                {/* Position 2: Mobile Menu and Griterr, Desktop: Hidden */}
                <div className="xl:hidden flex items-center gap-2">
                  <FiMenu className="md:hidden cursor-pointer size-8 mt-1" />
                  <div className="md:text-3xl text-2xl font-bold text-primary">
                    Griterr
                  </div>
                </div>

                {/* Position 3: Empty space */}
                <div className="flex-1"></div>

                {/* Position 4: Bell Icon */}
                <LuBell className="size-5 cursor-pointer" />

                {/* Position 5: Empty space for balance */}
                <div className="w-0"></div>
              </div>
              <Outlet />
            </div>
          </div>

          {/* Right Sidebar */}
          <div
            className="hidden xl:block fixed bg-gray-100 right-0 overflow-y-auto min-[1279px]:max-[1330px]:w-100 min-[1331px]:w-100"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              // top: "80px",
            }}
          >
            <style>
              {`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            <div className="flex items-center justify-between bg-white p-5 h-17 sticky top-0 z-20 w-full">
              {/* Position 1: Desktop Page Title, Mobile: Hidden */}

              {/* Position 2: Mobile Menu and Griterr, Desktop: Hidden */}

              {/* Position 3: Empty space */}
              <div className="flex-1"></div>

              {/* Position 5: Empty space for balance */}
              <div className="w-0"></div>
            </div>
            {!locate && <RightSidebar />}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MainLayout;
