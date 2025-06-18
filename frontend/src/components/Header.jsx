import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LuBell } from "react-icons/lu";

const Header = ({isCollapsed}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-3 pl-4 bg-white shadow-sm">
      {/* left side */}
      <div className="flex items-center gap-6 xl:flex-1">
        <FiMenu className="md:hidden cursor-pointer size-8" />
        <div className="xl:ml-30 text-3xl font-bold text-primary">Griterr</div>
      </div>

      {/* center */}
      <div className="hidden xl:flex items-center justify-between flex-2">
        <span className="text-base font-medium mr-4">Home Feed</span>
        <LuBell className="size-5 cursor-pointer" />
      </div>

      {/* right side */}
      <div className="xl:hidden flex items-center justify-end">
        <LuBell className="size-5 cursor-pointer" />
      </div>

      {/* right side */}
      <div className="hidden xl:block flex-1"></div>
    </header>
  );
};

export default Header;
