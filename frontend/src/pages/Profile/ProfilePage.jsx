import React, { useState } from "react";
import { MdLocationOn } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import {
  FaCheckCircle,
  FaRegEdit,
  FaRegListAlt,
  FaUserTag,
  FaFolderOpen,
} from "react-icons/fa";
import { MdPoll } from "react-icons/md";
import { TiThMenuOutline } from "react-icons/ti";
import { CgMenuLeft } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import profile from '../../assets/profile.png'
import food from '../../assets/bg.png'
import post from '../../assets/post.png'



const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Activity");

  const tabs = [
    {
      name: "Activity",
      icon: <TiThMenuOutline className="max-sm:text-2xl" size={26} />,
    },
    {
      name: "Polls",
      icon: <CgMenuLeft className="max-sm:text-2xl" size={26} />,
    },
    {
      name: "Tagged",
      icon: <FaUserTag className="max-sm:text-2xl" size={26} />,
    },
    {
      name: "Collection",
      icon: <CiBookmark className="max-sm:text-2xl" size={26} />,
    },
  ];

  return (
    <main className="bg-white min-h-screen font-sans antialiased">
      {/* Cover Photo */}
      <div className="relative w-full h-56 md:h-64">
        <img
          src={food}
          alt="cover"
          className="w-full h-full object-cover rounded-2xl max-md:rounded-none"
        />
        {/* <div className="absolute left-8 bottom-[-56px]"> Profile Image */}

        <div className="grid grid-cols-1 md:flex md:flex-row md:items-center md:justify-between">
          {/* Profile Picture - Centered on mobile */}
          <div className="order-1 md:order-1 flex justify-center md:block">
            <div className="absolute left-1/2 -translate-x-1/2 md:left-8 -bottom-14 md:translate-x-0">
              <img
                src={profile}
                alt="profile"
                className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
              />
            </div>
          </div>
          {/* Stats - Moved to bottom on mobile */}
          <div className="order-4 md:order-2 hidden md:flex gap-8 p-4 pr-0 justify-center md:justify-start">
            <div className="text-center">
              <p className="text-lg font-semibold">2.5k</p>
              <p className="text-gray-500 text-xs">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">1.2k</p>
              <p className="text-gray-500 text-xs">Following</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">152</p>
              <p className="text-gray-500 text-xs">Posts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 pb-6 max-md:container max-md:mx-auto max-md:px-6">
        <div className="grid grid-cols-1 md:flex md:flex-row md:items-center md:justify-between">
          {/* Name and Bio */}
          <div className="order-2 md:order-1 px-6 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h1 className="text-2xl font-semibold">Mohan Sharma</h1>
              <FaCheckCircle className="text-blue-500" title="Verified" />
            </div>
            {/* Mission text - hidden on mobile, shown on desktop */}
            <p className="text-gray-600 mt-1 hidden md:block">
              On a mission to find best street food in Mumbai!
            </p>
          </div>
          {/* Edit Profile Button */}
          <div className="order-3 md:order-2 pt-5 max-md:pt-1 flex justify-center md:block">
            <button className="bg-black max-md:bg-white max-md:text-blue-500 text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-800 shadow">
              Edit Profile
            </button>
          </div>

          {/* Stats and Mission text for mobile */}
          <div className="order-4 md:order-2 flex flex-col items-center gap-4 p-4 pr-0 md:hidden">
            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-lg font-semibold">2.5k</p>
                <p className="text-gray-500 text-xs">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">1.2k</p>
                <p className="text-gray-500 text-xs">Following</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold">152</p>
                <p className="text-gray-500 text-xs">Posts</p>
              </div>
            </div>
            {/* Mission text - shown only on mobile */}
            <p className="text-gray-600 text-center">
              On a mission to find best street food in Mumbai!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-14 mt-8 max-md:mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 py-2 px-1 text-sm font-medium border-b-2 transition-all
                  ${
                    activeTab === tab.name
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-400 hover:text-blue-500"
                  }
                `}
            >
              <span
                className={`${
                  activeTab === tab.name ? "text-blue-500" : "text-gray-400"
                }`}
              >
                {tab.icon}
              </span>
              <span className="max-sm:hidden">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Activity Section (Sample Post) */}
        {activeTab === "Activity" && (
          <div className="mt-8">
            {/* Post Header */}
            <div className="flex items-center gap-3">
              <img
                src={profile}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="font-medium text-sm">themohanreviews</span>
                <span className="text-xs text-gray-400">
                  #review #restaurant #italianfood
                </span>
              </div>
              <span className="ml-auto text-gray-400 text-xl cursor-pointer">
                ⋮
              </span>
            </div>
            {/* Post Content */}
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-700">
              <MdLocationOn className="text-lg text-gray-500" />
              <span className="font-medium">PetersBistro, New York City</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(4)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
              <FaStar className="text-gray-300" />
              <span className="ml-2 text-sm font-medium text-gray-700">
                4.5
              </span>
            </div>
            <p className="mt-2 text-gray-700 text-sm">
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
