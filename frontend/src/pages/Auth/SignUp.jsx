import React, { useState } from "react";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaCity,
  FaRegEye,
  FaRegEyeSlash,
  FaChevronDown,
} from "react-icons/fa";
import { TiArrowSortedDown, TiLocation } from "react-icons/ti";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="pt-10 max-sm:pt-0 bg-white font-sans pb-12">
      <div className="w-full max-w-sm max-sm:max-w-xs mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>

        <p className="text-center font-semibold text-md mb-6">
          Signup now and Let’s get started
        </p>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-black mb-1">
            Name
          </label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D9BF0] text-md" />
            <input
              type="text"
              placeholder="Your name"
              className="w-full pl-12 pr-3 py-2  bg-[#F7F7F7] bg-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-black mb-1">
            Email
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D9BF0] text-md" />
            <input
              type="email"
              placeholder="Yourmail@gmail.com"
              className="w-full  pl-12 pr-3 py-2  bg-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-black mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="************"
              className="w-full pl-12 pr-12 py-2 bg-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D9BF0] text-xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* City */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-black mb-1">
            Select City
          </label>
          <div className="relative">
            <TiLocation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1D9BF0] text-2xl" />

            {/* Custom dropdown arrow with icon */}
            <TiArrowSortedDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black text-2xl font-bold pointer-events-none" />

            <select className="appearance-none w-full  pl-12 pr-8 py-2 bg-[#F7F7F7] text-gray-700 font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select</option>
              <option>New York</option>
              <option>Delhi</option>
              <option>Tokyo</option>
            </select>
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-start mb-4">
          <input type="checkbox" className="mt-1 mr-2" />
          <p className="text-xs text-gray-600">
            By signing up to create an account I accept Company’s Terms of Use
            and Our Privacy Policy.
          </p>
        </div>

        {/* Sign Up Button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded-4xl hover:bg-blue-600 transition">
          Sign Up
        </button>

        {/* Divider */}
        <div className="my-6 text-center text-sm text-grey-400">
          -or Continue with-
        </div>

        {/* Social Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button className="p-2 border rounded-full hover:bg-gray-100 transition">
            <FcGoogle className="text-xl" />
          </button>
          <button className="p-2 border rounded-full hover:bg-gray-100 transition">
            <FaFacebookF className="text-blue-600 text-xl" />
          </button>
          <button className="p-2 border rounded-full hover:bg-gray-100 transition">
            <FaApple className="text-black text-xl" />
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-grey-600 font-medium hover:underline"
          >
            Login Here
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
