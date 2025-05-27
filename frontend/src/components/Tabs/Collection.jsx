import React from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi"; // Assuming you'll use react-icons for the menu

const Collection = ({
  mainImage,
  sideImage1,
  sideImage2,
  title,
  posts,
  views,
}) => {
  return (
    <>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-2/3">
          <img
            className="w-full object-cover h-full"
            src={mainImage}
            alt="Main Collection"
          />
        </div>
        {/* Side Images Section */}
        <div className="w-1/3 flex flex-col gap-3">
          <div className="flex-1">
            <img
              className="h-full w-full object-cover"
              src={sideImage1}
              alt="Side Collection 1"
            />
          </div>
          <div className="flex-1">
            <img
              className="h-full w-full object-cover"
              src={sideImage2}
              alt="Side Collection 2"
            />
          </div>
        </div>
      </div>

      {/* Content Section (Title, Stats, Menu) */}

      <div className="flex items-center justify-between">
        {/* Title and Stats */}
        <div className="mt-4">
          <div className="text-sm font-medium text-color-gray leading-tight">
            {title}
          </div>
          <p className="mt-1 text-xs font-normal text-color-gray">
            {posts} Posts • {views} Views
          </p>
        </div>

        {/* Menu Icon */}
        <span className="text-color-grey cursor-pointer">
          <PiDotsThreeOutlineVerticalFill className="size-6" />
        </span>
      </div>
    </>
  );
};

export default Collection;
