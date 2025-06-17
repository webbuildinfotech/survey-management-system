import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LuBell } from "react-icons/lu";

const Header = () => {
  return (
    <header className=" fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-3 pl-6 bg-white shadow-sm">
      <div className="flex items-center flex-1">
        <FiMenu className="md:hidden cursor-pointer size-8" />
        <div className="ml-30 text-3xl font-bold text-primary">Griterr</div>
      </div>
      {/* Center: Home Feed + Bell */}

      <div className="flex flex-2 items-end justify-between h-10 ">
        <span className="text-base font-medium mr-2">Home Feed</span>
        <LuBell className="size-5" />
      </div>

      {/* <div className="flex items-center justify-between flex-2">
        <span className="text-base font-medium">Home Feed</span>
        <LuBell className="size-5" />
      </div> */}
      {/* Right: Empty for spacing */}
      <div className="flex-1"></div>
    </header>
  );
};

export default Header;
