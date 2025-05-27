import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LuBell } from "react-icons/lu";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdNavigateBefore } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isProfilePage = location.pathname === "/profile";
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <>
      {!isProfilePage ? (
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white shadow-md">
          <div className="flex items-center">
            <FiMenu className="cursor-pointer size-8" />
            <div className="ml-4 text-3xl font-bold text-primary">Griterr</div>
          </div>
          <span className="cursor-pointer size-6">
            <LuBell className="size-6" />
          </span>
        </div>
      ) : (
        <React.Fragment>
          {/* For fixed position header Public Profile*/}
          <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white">
            <div className="flex items-center">
              <MdNavigateBefore
                className="cursor-pointer size-8"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              />
              <span className="ml-2 font-medium text-base">
                @themohanreviews
              </span>
            </div>
            <span className="cursor-pointer text-color-grey">
              <PiDotsThreeOutlineVerticalFill className="size-6" />
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
        </React.Fragment>
      )}
    </>
  );
};

export default Header;
