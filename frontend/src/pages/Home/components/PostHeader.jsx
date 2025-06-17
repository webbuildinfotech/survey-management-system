import React from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';
import { PiDotsThreeOutlineVerticalFill } from 'react-icons/pi';

const PostHeader = ({ profile, username, timeAgo, hashtags }) => {
  return (
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
  );
};

export default PostHeader;