import React, { useState } from "react";
import profile from "../../assets/profile.png";
import food from "../../assets/bg.png";
import post from "../../assets/post.png";
import { BsPatchCheckFill } from "react-icons/bs";
import { Tabs } from "../../components/Tabs/Tab";
import TabsComponent from "../../components/Tabs/ActiveTabs";
import Activity from "../../components/Tabs/Activity";
import Polls from "../../components/Tabs/Polls";
import { PollData } from "../../data/PollData";
import Collection from "../../components/Tabs/Collection";
import Tag from "../../components/Tabs/Tag";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("Tag");

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
              <p className="md:text-2xl text-base font-medium">2.5k</p>
              <p className="text-color-grey md:text-base text-xs font-normal">
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="md:text-2xl text-base font-medium">1.2k</p>
              <p className="text-color-grey md:text-base text-xs font-normal">
                Following
              </p>
            </div>
            <div className="text-center">
              <p className="md:text-2xl text-base font-medium">152</p>
              <p className="text-color-grey md:text-base text-xs font-normal">
                Posts
              </p>
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
              <h1 className="md:text-2xl text-base font-medium">
                Mohan Sharma
              </h1>
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
              Following
            </button>
          </div>

          {/* Stats and Mission text for mobile */}
          <div className="order-4 md:order-2 flex flex-col items-center gap-4 p-4 pr-0 md:hidden">
            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="md:text-2xl text-base font-medium">2.5k</p>
                <p className="text-color-grey md:text-base text-xs font-normal">
                  Followers
                </p>
              </div>
              <div className="text-center">
                <p className="md:text-2xl text-base font-medium">1.2k</p>
                <p className="text-color-grey md:text-base text-xs font-normal">
                  Following
                </p>
              </div>
              <div className="text-center">
                <p className="md:text-2xl text-base font-medium">152</p>
                <p className="text-color-grey md:text-base text-xs font-normal">
                  Posts
                </p>
              </div>
            </div>
            {/* Mission text - shown only on mobile */}
            <p className="text-gray-600 text-center md:text-base text-xs font-normal">
              On a mission to find best street food in Mumbai!
            </p>
          </div>
        </div>

        {/* Tabs */}
        <TabsComponent
          tabs={Tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Activity Section (Sample Post) */}
        {activeTab === "Activity" && (
          <div className="mt-8">
            <Activity
              profile={profile}
              post={post}
              username="themohanreviews"
              location="PetersBistro, New York City"
              stars={4}
              timeAgo="8h ago"
              hashtags="#review #restaurant #italianfood"
              description="is a charming Italian restaurant with a warm ambiance making it ideal for a cozy dinner. Don't skip the tiramisu for dessert; it's a delightful finish to your meal!"
              tagName="petersbistro"
            />
          </div>
        )}

        {activeTab === "Polls" && (
          <div className="mt-8">
            <Polls
              profile={profile}
              username="themohanreviews"
              timeAgo="8h ago"
              hashtags="#review #restaurant #italianfood"
              tagName="petersbistro"
              content="If ya’ll were in the market to buy an EV for commute, which company would you go for?"
              pollData={PollData}
            />
          </div>
        )}

        {activeTab === "Tagged" && (
          <div className="mt-8">
            <Tag
              profile={profile}
              post={post}
              username="nandinisharma23"
              location="PetersBistro, New York City"
              stars={5}
              timeAgo="8h ago"
              hashtags="#review  #restaurant  #italianfood"
              description="@themohanreviews thanks to your review I decided to try @petersbistro in NYC and man it was the best meal I have had in a long time! Really loved the pizza there and the thickshakes! Definitely gonna spread the word ❤️ "
            />
          </div>
        )}

        {activeTab === "Collection" && (
          <div className="mt-8">
            <Collection
              mainImage="/images/collection/restaurent.png"
              sideImage1="/images/collection/view1.png"
              sideImage2="/images/collection/view2.png"
              title="Best Chinese Restaurants in Mumbai  🔥"
              posts={24}
              views="25k"
            />
          </div>
        )}

        {activeTab === "Tag" && (
          <div className="mt-8">
            <Tag
              profile={profile}
              post={post}
              username="nandinisharma23"
              location="PetersBistro, New York City"
              stars={3}
              timeAgo="8h ago"
              hashtags="#review  #restaurant  #italianfood"
              description="@themohanreviews thanks to your review I decided to try @petersbistro in NYC and man it was the best meal I have had in a long time! Really loved the pizza there and the thickshakes! Definitely gonna spread the word ❤️ "
            />
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
