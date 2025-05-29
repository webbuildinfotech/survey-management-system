import React from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdNavigateBefore } from "react-icons/md";

const UserHeader = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  return (
    <React.Fragment>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white">
        <div className="flex items-center">
          <MdNavigateBefore
            className="cursor-pointer size-8"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <span className="ml-2 font-medium text-base">@themohanreviews</span>
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
          <span className="ml-2 font-medium text-base">@themohanreviews</span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserHeader;
