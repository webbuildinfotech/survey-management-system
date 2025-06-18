import React, { useState } from "react";
import {
  FaCut,
  FaUtensils,
  FaCar,
  FaHospital,
  FaUniversity,
  FaPlane,
  FaDumbbell,
  FaSpa,
  FaShoppingBag,
  FaHotel,
  FaGamepad,
  FaCoffee,
  FaGlassCheers,
} from "react-icons/fa";

import { LuSquareBottomDashedScissors } from "react-icons/lu";
import { restaurants } from "./RestaurantData";

const SearchPage = () => {
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  //
  const categories = [
    { icon: <LuSquareBottomDashedScissors  />, name: "Salon" },
    { icon: <FaUtensils  />, name: "Restaurants" },
    { icon: <FaCar  />, name: "Dealership" },
    { icon: <FaHospital  />, name: "Hospital" },
    { icon: <FaUniversity  />, name: "Bank" },
    { icon: <FaPlane  />, name: "Travel" },
    { icon: <FaDumbbell  />, name: "Gym" },
    { icon: <FaSpa  />, name: "Spa" },
    { icon: <FaShoppingBag  />, name: "Shopping" },
    { icon: <FaHotel  />, name: "Hotels" },
    { icon: <FaGamepad  />, name: "Gaming" },
    { icon: <FaCoffee  />, name: "Cafe" },
    { icon: <FaGlassCheers  />, name: "Bars" },
  ];

  // First 8 categories to display (in one line)
  const displayedCategories = showAllCategories
    ? categories
    : categories.slice(0, 8);

  // First 4 restaurants to display
  const displayedRestaurants = showAllRestaurants
    ? restaurants
    : restaurants.slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Center header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Find the <span className="text-blue-500">best</span> places in town
        </h1>
        <p className="text-gray-600 mb-6">Real Reviews. Smarter Choices</p>

        {/* White search bar icon */}
        <div className="relative bg-white rounded-2xl shadow-lg">
          <input
            type="text"
            placeholder="Search business or category"
            className="w-full p-4 pl-12 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="w-6 h-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Categories icons */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">What are you looking for</h2>
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setShowAllCategories(!showAllCategories)}
          >
            View All
          </button>
        </div>
        <div className="w-full overflow-x-auto pb-4 hide-scrollbar ">
        <div className="flex gap-8 xl:gap-16" style={{ 
              width: 'calc(8px * 5 + 2rem)',  // मोबाइल में 5 कैटेगरी की width + gap
              '@media (min-width: 768px)': {
                width: '100%'  // डेस्कटॉप में पूरी width
              }
            }}>
            {displayedCategories.slice(0, 8).map((category, index) => (
              <div key={index} className="flex flex-col items-center cursor-pointer group pb-4">
                <div className="w-12 h-12 bg-restaurant rounded-lg flex items-center justify-center mb-2  transition-colors">
                  <div className="text-2xl">
                    {category.icon}
                  </div>
                </div>
                <span className="text-xs font-medium text-center whitespace-nowrap">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Restaurants with correct rating */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Best restaurants near you</h2>
          <button
            className="text-blue-500 text-sm hover:underline"
            onClick={() => setShowAllRestaurants(!showAllRestaurants)}
          >
            View All
          </button>
        </div>
        <div className="w-full overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4 md:gap-4" style={{ 
              width: 'calc(160px * 2 + 1rem)',  // मोबाइल में 2 कार्ड्स की width + gap
              '@media (min-width: 768px)': {
                width: '100%'  // डेस्कटॉप में पूरी width
              }
            }}>
            {displayedRestaurants.map((restaurant, index) => (
              <div key={index} className="w-[160px] md:w-auto flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-24 md:h-32 object-cover"
                />
                <div className="p-2">
                  <h3 className="font-normal text-base md:text-lg truncate">
                    {restaurant.name}
                  </h3>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 md:w-5 md:h-5 ${
                          star <= Math.floor(restaurant.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm md:text-base">
                      {restaurant.rating}
                    </span>
                    <span className="text-gray-500 text-xs md:text-sm ml-1">
                      ({restaurant.reviews})
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm truncate">
                    {restaurant.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending polls */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Trending polls</h2>
        {/* Trending polls content */}
      </div>
    </div>
  );
};

export default SearchPage;
