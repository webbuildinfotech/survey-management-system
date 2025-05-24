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
        <p className="text-[18px] font-medium mb-4">You might like</p>
        {suggestions.map((user, index) => (
          <div key={index} className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-3">
              <div className="w-13 h-13 bg-profile rounded-full"></div>
              <div>
                <p className="text-base font-normal outfit-font">{user.name}</p>
                <p className="text-sm font-normal text-color-grey outfit-font">
                  {user.username}
                </p>
              </div>
            </div>
            <button
              className="bg-primary outfit-font text-white text-xs font-medium px-3 py-2 rounded-full"
              
            >
              Follow
            </button>
          </div>
        ))}
      </div>

      {/* Polls */}
      <div>
        <h2 className="text-[18px] font-medium mb-4 mt-5">Trending Polls</h2>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div>
              <p  className="text-xs font-normal outfit-font">themohanreviews</p>
              <p className="text-[12px] text-color-grey">
              #survey #cars  #cardealerships
              </p>
            </div>
          </div>
          <button className="border border-text-primary text-primary text-sm px-3 py-1 rounded-full">
            Following
          </button>
        </div>

        <div  className="outfit-font text-xs font-medium text-color-black mb-2">
        If ya’ll were in the market to buy a car for commute, what kind of car would you go for?
        </div>

        <div className="p-5">
          <p className="text-xs font-normal mb-3 outfit-font">388 votes</p>

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
                <span className="font-medium text-xs outfit-font">{option}</span>
              </label>
            ))}
          </form>

          <button className="w-full outfit-font bg-primary p-2  text-white  rounded-full text-xs font-medium">
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
