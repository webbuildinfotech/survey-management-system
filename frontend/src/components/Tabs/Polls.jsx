// components/PostCard.jsx
import React from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaStar } from "react-icons/fa";

const Polls = ({ profile, username, timeAgo, hashtags, content, pollData }) => {
  return (
    <>
      {/* Post Header */}
      <div className="flex items-center gap-3">
        <img src={profile} alt="profile" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col">
          {/* Username + Verified badge */}
          <div className="flex items-center gap-2">
            <span className="font-normal md:text-base text-xs outfit-font">
              {username}
            </span>
            <BsPatchCheckFill
              className="text-primary size-4 block md:hidden"
              title="Verified"
            />
            <div className="flex items-center space-x-1 text-base text-color-grey font-normal md:hidden">
              <span className="mx-1 text-lg leading-none">•</span>
              <span className="text-xs">{timeAgo}</span>
            </div>
          </div>
          <span className="font-normal text-sm text-color-grey">
            {hashtags}
          </span>
        </div>

        <span className="ml-auto text-color-grey cursor-pointer">
          <PiDotsThreeOutlineVerticalFill className="size-6" />
        </span>
      </div>

      {/* Post Content */}
      <div className="flex items-center mt-4 text-color-black">
        <span className="font-medium md:text-base text-xs">{content}</span>
      </div>

      {/* Poll Section - Refined to match image exactly */}
      {pollData && (
        <div className="mt-4">
          {/* Total Votes */}
          <div className="text-sm font-normal text-color-grey mb-2">
            {pollData.totalVotes} votes
          </div>

          {/* Poll Options */}
          {pollData.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center border rounded-xl mb-2 overflow-hidden ${
                option.isWinner ? "border-blue" : "border-grey"
              }`}
            >
              {/* Logo Section */}
              <div
                className="flex items-center justify-center w-[64px] h-[54px]"
                style={{ backgroundColor: option.logoBgColor }}
              >
                <img
                  src={option.logo}
                  alt={option.name}
                  className="object-contain"
                />
              </div>

              {/* Content Section with Percentage Background */}
              <div className="relative flex items-center flex-grow h-[55px] px-4">
                {/* Progress Bar Background */}
                <div
                  className="absolute inset-0"
                  style={{
                    width: `${option.percentage}%`,
                    backgroundColor: option.isWinner ? "#DBEAFE" : "#E5E7EB",
                    opacity: 0.7,
                    zIndex: 0,
                  }}
                ></div>

                {/* Option Name and Percentage */}
                <span className="relative z-10 font-medium text-sm mr-auto text-color-black">
                  {option.name}
                </span>
                <span className="relative z-10 font-medium text-sm text-color-black">
                  {option.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Polls;
