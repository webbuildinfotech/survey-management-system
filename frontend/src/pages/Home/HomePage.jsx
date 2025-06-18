import React from "react";

import Post from "./components/Post";
import { BsPatchCheckFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { AiOutlineHeart } from "react-icons/ai";
import { LuMessageCircle } from "react-icons/lu";

const HomePage = () => {
  const bakeries = [
    {
      name: "Bangalore Iyer-ngar Bakery",
      image: "/images/collection/restaurent.png",
    },
    { name: "Mumbai Chaat House", image: "/images/collection/restaurent1.png" },
    { name: "Delhi Diner", image: "/images/collection/view.png" },
    { name: "Chennai Spice Corner", image: "/images/collection/view1.png" },
    { name: "Kolkata Sweets", image: "/images/collection/view2.png" },
  ];
//test
  return (
    <>
      <div className="p-4 md:ml-12">
        {/* Restaurant Image Gallery */}
        <div className="mb-4 relative">
          <div className="grid grid-cols-1 gap-4">
            <img
              src="/images/collection/restaurent.png"
              alt="Restaurant"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Interaction Section */}
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

      <Post />
  
    </>
  );
};

export default HomePage;
