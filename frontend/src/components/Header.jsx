import React, { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LuBell } from "react-icons/lu";

const Header = () => {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center">
        <FiMenu className="cursor-pointer size-8" />
        <div className="ml-4 text-3xl font-bold text-primary">Griterr</div>
      </div>
      <span className="cursor-pointer size-6">
        <LuBell className="size-6" />
      </span>
    </header>
  );
};

export default Header;
