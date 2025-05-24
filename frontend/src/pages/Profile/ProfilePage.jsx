import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

import profile from "../../assets/profile.png";
import food from "../../assets/bg.png";
import post from "../../assets/post.png";
import { BsPatchCheckFill } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Tabs } from "../../components/Tabs/Tab";
import TabsComponent from "../../components/Tabs/ActiveTabs";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Activity");

  return (
    <main className="bg-white min-h-screen font-sans antialiased">
      {/* Cover Photo */}
      <div className="relative w-full h-56 md:h-74">
        <img
          src={food}
          alt="cover"
          className="w-full h-full object-cover rounded-2xl max-md:rounded-none"
        />
        {/* <div className="absolute left-8 bottom-[-56px]"> Profile Image */}

        <div className="grid grid-cols-1 md:flex md:flex-row md:items-center md:justify-between">
          {/* Profile Picture - Centered on mobile */}
          <div className="order-1 md:order-1 flex justify-center md:block">
            <div className="absolute left-1/2 -translate-x-1/2 md:left-8 -bottom-18 md:translate-x-0">
              <img
                src={profile}
                alt="profile"
                className="size-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
          </div>
          {/* Stats - Moved to bottom on mobile */}
          <div className="order-4 md:order-2 hidden md:flex gap-8 p-4 pr-0 justify-center md:justify-start">
            <div className="text-center">
              <p className="text-2xl font-medium">2.5k</p>
              <p className="text-color-grey text-base font-normal">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-medium">1.2k</p>
              <p className="text-color-grey text-base font-normal">Following</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-medium">152</p>
              <p className="text-color-grey text-base font-normal">Posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 pb-6 max-md:container max-md:mx-auto max-md:px-6">
        <div className="grid grid-cols-1 md:flex md:flex-row md:items-center md:justify-between">
          {/* Name and Bio */}
          <div className="order-2 md:order-1 px-6 text-center md:text-left mt-5">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-medium">Mohan Sharma</h1>
              <BsPatchCheckFill
                className="text-primary size-8"
                title="Verified"
              />
            </div>
            {/* Mission text - hidden on mobile, shown on desktop */}
            <p className="text-gray-600 mt-1 text-base font-normal hidden md:block">
              On a mission to find best street food in Mumbai!
            </p>
          </div>
          {/* Edit Profile Button */}
          <div className="order-3 md:order-2 pt-10 max-md:pt-1 flex justify-center md:block">
            <button
              className="bg-black max-md:bg-white max-md:text-[#1d9bf0] text-white 
            px-6 py-2 rounded-2xl font-medium  max-md:border max-md:border-text-primary text-xs outfit-font"
            >
              Edit Profile
            </button>
          </div>

          {/* Stats and Mission text for mobile */}
          <div className="order-4 md:order-2 flex flex-col items-center gap-4 p-4 pr-0 md:hidden">
            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-medium">2.5k</p>
                <p className="text-color-grey text-base font-normal">
                  Followers
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium">1.2k</p>
                <p className="text-color-grey text-base font-normal">
                  Following
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-medium">152</p>
                <p className="text-color-grey text-base font-normal">Posts</p>
              </div>
            </div>
            {/* Mission text - shown only on mobile */}
            <p className="text-gray-600 text-center text-base font-normal">
              On a mission to find best street food in Mumbai!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <TabsComponent tabs={Tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Activity Section (Sample Post) */}
        {activeTab === "Activity" && (
          <div className="mt-8">
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <img
                src={profile}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex flex-col">
                {/* Username + Verified badge on one line */}
                <div className="flex items-center gap-1">
                  <span className="font-normal text-base outfit-font">
                    themohanreviews
                  </span>
                  <BsPatchCheckFill
                    className="text-primary size-4 block md:hidden" // Adjust size if needed
                    title="Verified"
                  />
                </div>

                {/* Hashtags below */}
                <span className="font-normal text-sm text-color-grey">
                  #review #restaurant #italianfood
                </span>
              </div>

              <span className="ml-auto text-color-grey cursor-pointer">
                <CiMenuKebab className="size-6" />
              </span>
            </div>
            {/* Post Content */}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
              <HiOutlineLocationMarker className="size-6" />
              <span className="font-medium text-base">
                PetersBistro, New York City
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(4)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
              <FaStar className="text-color-grey" />

              <span className="ml-2 text-base font-medium text-color-grey hidden sm:inline">
                4.5
              </span>
              <span className="ml-2 text-base font-medium text-color-grey sm:hidden">
                4/5
              </span>
            </div>
            <p className="mt-2 text-color-black text-base font-normal">
              It is a charming Italian restaurant with a warm ambiance making it
              ideal for a cozy dinner. Don't skip the tiramisu for dessert; it's
              a delightful finish to your meal!
            </p>
            <div className="mt-3 rounded-xl overflow-hidden">
              <img
                src={post}
                alt="restaurant"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
