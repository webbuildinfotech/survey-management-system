import React from "react";
import { Link } from "react-router-dom";


const Header = () => {
  return (
    // <header className="bg-white  px-6 flex justify-between items-center">

    <header className="bg-white justify-between items-center flex shadow-md sticky">
      <div className="container mx-auto px-2 pt-4 pb-4">
        <Link
          to="/"
          style={{ fontFamily: "'Josefin Sans', sans-serif" }}
          className="text-3xl font-bold text-twitter-blue "
        >
          Griterr
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
