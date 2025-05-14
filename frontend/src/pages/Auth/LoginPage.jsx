import React, { useState } from "react";
import { FaEnvelope, FaLock, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaApple } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="pt-10 max-sm:pt-0 bg-white font-sans pb-12">
      <div className="w-full max-w-sm max-sm:max-w-xs mx-auto">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-2">Hello!</h2>
        <p className="text-center font-semibold text-md mb-6">
          Login to your account! below
        </p>

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
              className="w-full pl-12 pr-3 py-2 bg-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center text-sm text-gray-600">
            <input type="checkbox" className="mr-2" />
            Remember Me
          </label>
          <a
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </a>
        </div>

        {/* Login Button */}
        <button className="w-full bg-blue-500 text-white py-2 rounded-4xl hover:bg-blue-600 transition">
          Login
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
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-grey-600 font-medium hover:underline"
          >
            Register Now!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
