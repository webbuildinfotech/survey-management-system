import React from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { IoIosStarOutline } from "react-icons/io";
import { FaRegStar } from "react-icons/fa";

import { MdOutlineStarPurple500 } from "react-icons/md"

const Tag = ({
  profile,
  post,
  username,
  location,
  stars,
  timeAgo,
  hashtags,
  description,
  tagName,
}) => {
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
      <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
        <span className="font-medium text-base">{location}</span>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <MdOutlineStarPurple500 
            key={i}
            className={i < stars ? "text-yellow-400 size-4" : "text-color-grey size-4"}
          />
        ))}
        <span className="ml-2 text-base font-medium text-color-grey hidden sm:inline">
          {stars}.0
        </span>
        <span className="ml-2 text-base font-medium text-color-grey sm:hidden">
          {stars}/5
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-color-black md:text-base text-xs font-normal">
        {description.split(" ").map((word, idx) =>
          word.startsWith("@") ? (
            <span key={idx} className="text-primary font-medium">
              {word}
            </span>
          ) : (
            <span key={idx}> {word} </span>
          )
        )}
      </p>

      {/* Post Image */}
      <div className="mt-3 rounded-xl overflow-hidden">
        <img
          src={post}
          alt="restaurant"
          className="w-full h-auto object-cover"
        />
      </div>
    </>
  );
};

export default Tag;
