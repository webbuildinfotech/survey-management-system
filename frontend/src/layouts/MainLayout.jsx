import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LeftSidebar from "../components/Sidebar/LeftSidebar";
import RightSidebar from "../components/Sidebar/RightSidebar";
import Header from "../components/Header";
import { RoutePaths } from "../routes/Path";
import BottomNavigation from "./BottomNavigation";

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

  return (
    <div className="flex flex-col min-h-screen">
      <Header isCollapsed={isSidebarCollapsed} pageTitle={getPageTitle()}/>
      <main className="flex flex-1 mt-14">
        {/* Left Sidebar - Fixed on medium and up */}
        <div
          className={`hidden md:block fixed left-0 transition-all duration-300 ${
            isSidebarCollapsed ? "w-16 py-8 p-1" : ""
          } border-r-none`}
        >
          <LeftSidebar isCollapsed={isSidebarCollapsed} />
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 bg-gray-100 transition-all duration-300 ${
            isSidebarCollapsed ? "md:ml-16" : "md:ml-16 xl:ml-100"
          } xl:mr-100 max-xl:px-8 max-md:px-0 `}
        >
          <Outlet />
        </div>

        {/* Right Sidebar */}
        {!locate && (
          <div
            className="hidden xl:block fixed bg-gray-100 right-0 top-14 p-5 overflow-y-auto min-[1279px]:max-[1330px]:w-90 min-[1331px]:w-100"
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
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default MainLayout;