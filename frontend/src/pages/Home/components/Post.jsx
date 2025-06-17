import React from "react";
import { BsPatchCheckFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { AiOutlineHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";
import { FiShare } from "react-icons/fi";

const Post = () => {
  const bakeries = [
    {
      name: "Banglore lye-ngar Bakery",
      image: "/images/collection/restaurent.png",
      rating: "4.2"
    },
    {
      name: "Mumbai Chaat House",
      image: "/images/collection/restaurent1.png",
      rating: "4.5"
    },
    {
      name: "Delhi Diner",
      image: "/images/collection/view.png",
      rating: "4.0"
    },
    {
      name: "Chennai Spice Corner",
      image: "/images/collection/view1.png",
      rating: "4.3"
    },
    {
      name: "Kolkata Sweets",
      image: "/images/collection/view2.png",
      rating: "4.6"
    }
  ];

  return (
    <div className="rounded-lg pt-4 mb-4">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src="/images/collection/restaurent.png"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
      <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold">themohanreviews</span>
            <BsPatchCheckFill className="text-blue-500 text-sm" />
            <span className="text-gray-500 text-sm">• 8h ago</span>
          </div>
          <span className="font-normal text-sm text-color-grey">
            #review #restaurant #italianfood
          </span>
        </div>
        <span className="ml-auto text-gray-500">
          <PiDotsThreeOutlineVerticalFill />
        </span>
      </div>

      {/* Poll Question */}
      <div className="mb-4">
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
              <div className="absolute bottom-0 left-0 bg-blue-500 text-white px-3 py-1 rounded-tr-lg flex items-center gap-1">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="font-medium">{bakery.rating}</span>
              </div>
            </div>
            {/* Name with blue background */}
            <div className="w-full mt-2 py-2 px-1 rounded-lg">
              <p className="text-sm text-center text-gray-800">{bakery.name}</p>
            </div>
          </div>
        ))}
        {/* View More Button */}
        <div className="flex flex-col items-center justify-center aspect-square bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer">
          <div className="text-3xl text-blue-500 mb-1">+</div>
          <span className="text-sm text-gray-800 text-center">View More<br />Options</span>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center gap-6 text-gray-500">
        <div className="flex items-center gap-2">
          <AiOutlineHeart className="text-xl" />
          <span className="text-sm">1.1k</span>
        </div>
        <div className="flex items-center gap-2">
          <BiComment className="text-xl" />
          <span className="text-sm">252</span>
        </div>
      </div>
      <span className="text-sm text-gray-400">Liked by Karthik and others</span>
    </div>
  );
};

export default Post;
