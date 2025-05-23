import React, { useState } from "react";

const RightSidebar = () => {
  const [selectedOption, setSelectedOption] = useState("Electric Car");

  const suggestions = Array(4).fill({
    name: "Mohan Sharma",
    username: "@themohanreviews",
  });

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="w-full flex flex-col p-4 h-full min-h-screen">
      {/* Suggestions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">You might like</h2>
        {suggestions.map((user, index) => (
          <div key={index} className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.username}</p>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Polls */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Trending Polls</h2>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <p className="text-sm font-medium">themohanreviews</p>
              <p className="text-xs text-gray-500">
                #survey #cars #orderedchips
              </p>
            </div>
          </div>
          <button className="border border-blue-500 text-blue-500 text-sm px-3 py-1 rounded-full">
            Following
          </button>
        </div>

        <div className="text-sm text-gray-700 mb-2">
          If you'll were in the market to buy a car for commute, what kind of
          car would you go for?
        </div>

        <div className="p-5">
          <p className="text-xs text-gray-500 mb-3">388 votes</p>
   
          <form className="space-y-2 mb-4 p-2">
            {[
              "Electric Car",
              "Used IC Car",
              "Public Transport is the best!",
            ].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="poll"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => handleOptionChange(option)}
                  className="accent-blue-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </form>

          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full text-sm font-semibold">
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
