import React from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { AiOutlineHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { FiPlus, FiShare } from "react-icons/fi";
import { RiVipDiamondLine } from "react-icons/ri";
import { LuMessageCircle } from "react-icons/lu";
const Post = () => {
  const bakeries = [
    {
      name: "Banglore lye-ngar Bakery",
      image: "/images/collection/restaurent.png",
      rating: "4.2",
    },
    {
      name: "Mumbai Chaat House",
      image: "/images/collection/restaurent1.png",
      rating: "4.5",
    },
    {
      name: "Delhi Diner",
      image: "/images/collection/view.png",
      rating: "4.0",
    },
    {
      name: "Chennai Spice Corner",
      image: "/images/collection/view1.png",
      rating: "4.3",
    },
    {
      name: "Kolkata Sweets",
      image: "/images/collection/view2.png",
      rating: "4.6",
    },
  ];

  return (
    <div className="rounded-lg pt-4 mb-4 p-4 ">
      {/* Post Header */}
      <div className="md:flex md:items-start gap-3 mb-4">
        <div className="hidden md:block">
          <img
            src="/images/collection/restaurent.png"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
        {/* Avatar */}
        <div className="flex items-center gap-3 md:hidden">
          <img
            src="/images/collection/restaurent.png"
            alt="profile"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex flex-col">
            {/* Username + Verified badge */}
            <div className="flex items-center gap-2">
              <span className="font-normal md:text-base text-xs outfit-font">
                themohanreviews
              </span>
              <BsPatchCheckFill
                className="text-primary size-4 block md:hidden"
                title="Verified"
              />
              <div className="flex items-center space-x-1 text-base text-color-grey font-normal md:hidden">
                <span className="mx-1 text-lg leading-none">•</span>
                <span className="text-xs">8h ago</span>
              </div>
            </div>
            <span className="font-normal text-sm text-color-grey">
              #review #restaurant #italianfood
            </span>
          </div>

          <span className="ml-auto text-color-grey cursor-pointer">
            <PiDotsThreeOutlineVerticalFill className="size-6" />
          </span>
        </div>
        {/* Right Side: Name, Hashtags, Dots, and Post Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold hidden md:block">
              themohanreviews
            </span>
            <BsPatchCheckFill className="text-blue-500 text-sm hidden md:block" />
            <span className="text-gray-500 text-sm hidden md:block">
              • 8h ago
            </span>
            <span className="ml-auto text-gray-500 hidden md:block">
              <PiDotsThreeOutlineVerticalFill />
            </span>
          </div>
          <span className="font-normal text-sm text-color-grey mb-2 hidden md:block">
            #review #restaurant #italianfood
          </span>

          {/* ---- अब यहीं से आपकी सारी पोस्ट (पोल, इमेज ग्रिड, लाइक-कमेंट) ---- */}
          <div>
            {/* Poll Question */}
            <div className="mb-4 mt-5">
              <h2 className="text-lg font-normal">
                What are some of the best bakeries in town?
              </h2>
              <p className="text-gray-500 text-sm mt-1">388 votes</p>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-4">
              {bakeries.map((bakery, index) => (
                <div key={index} className="flex flex-col">
                  {/* Image Container with Rating Overlay */}
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={bakery.image}
                      alt={bakery.name}
                      className="w-full aspect-square object-cover"
                    />

                    {/* Rating Badge */}
                    <div className=" bg-blue-500 text-white px-3 py-1 flex items-center justify-center gap-1">
                      <RiVipDiamondLine />
                      <span className="font-medium">{bakery.rating}</span>
                    </div>
                  </div>
                  {/* Name with blue background */}
                  <div className="w-full mt-2 py-2 px-1 rounded-lg">
                    <p className="text-sm text-center text-gray-800">
                      {bakery.name}
                    </p>
                  </div>
                </div>
              ))}
              {/* View More Button */}
              <div className="flex flex-col">
                {/* Image Container with Rating Overlay */}
                <div className="relative rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center aspect-square w-full bg-blue-50 rounded-lg h-full">
                    <FiPlus className="text-blue-500 text-6xl" />
                  </div>
                  {/* Rating Badge जैसा खाली space या dummy badge */}
                  <div className="bg-blue-500 text-white px-3 py-1 flex items-center justify-center gap-1">
                    <RiVipDiamondLine />
                    <span className="font-medium">--</span>
                  </div>
                </div>
                {/* Name with blue background */}
                <div className="w-full mt-2 py-2 px-1 rounded-lg">
                  <span className="text-center text-gray-800 text-sm block">
                    View More
                    <br />
                    Options
                  </span>
                </div>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-2">
                <AiOutlineHeart className="text-2xl" />
                <span className="text-sm">1.1k</span>
              </div>
              <div className="flex items-center gap-2">
                <LuMessageCircle className="text-2xl" />
                <span className="text-sm">252</span>
              </div>
            </div>
            <span className="text-sm text-gray-400">
              Liked by Karthik and 5 others
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
