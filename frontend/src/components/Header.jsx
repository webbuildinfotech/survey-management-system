import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-white py-4 px-6 flex justify-between items-center">
         <div className="container px-2 pt-4 pb-8">
        <Link to="/" className="text-3xl font-josefin font-bold text-blue-600">
          Griter
        </Link>
        {/* <nav className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link>
        <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
      </nav> */}
      </div>
    </header>
  );
};

export default Header;
