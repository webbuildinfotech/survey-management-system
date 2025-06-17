import React from "react";

import Post from "./components/Post";
import { BsPatchCheckFill } from "react-icons/bs";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

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

  return (
    <>
      <div className="max-w-5xl mx-auto p-4">
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
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <button className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
            <span>1.1k</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
            <span>252</span>
          </div>
        </div>
        <span className="text-gray-600 block mb-4">
          Liked by Kaushal and 5 others
        </span>
        <Post />

      </div>


  
    </>
  );
};

export default HomePage;
