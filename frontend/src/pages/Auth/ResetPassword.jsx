import React, { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="pt-10 max-sm:pt-0 bg-white font-sans pb-12">
      <div className="w-full mx-auto px-5">
        {/* Heading */}
        <h2 className="text-2xl max-sm:text-xl font-bold text-center mb-2">
          Create New Password
        </h2>
        <p className="text-center font-semibold text-md max-sm:text-sm mb-6">
          This password should be different from the previous password.
        </p>

        {/* Password Form */}
        <div className="w-full max-w-md max-sm:w-xs mx-auto mt-10">
          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-black mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full pl-4 py-2 bg-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-black mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                className="w-full pl-4  py-2 bg-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Reset Button */}
          <button className="w-80 max-sm:w-40 mx-auto block bg-blue-400 text-white py-2 rounded-4xl hover:bg-blue-500 transition mt-10">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
