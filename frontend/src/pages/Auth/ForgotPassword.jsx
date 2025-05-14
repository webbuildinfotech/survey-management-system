import React from "react";
import { FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  return (
    <div className="pt-10 max-sm:pt-0 bg-white font-sans pb-12">
      <div className="w-full mx-auto px-5">
        {/* Heading */}
        <h2 className="text-2xl max-sm:text-xl font-bold text-center mb-2">
          Don’t worry. We forget things too. Let’s recover your password.
        </h2>
        <p className="text-center font-semibold text-md max-sm:text-sm mb-6">
          You will receive a password recovery SMS. Enter the 6-digit code in it
          to verify your email.
        </p>

        {/* Container for Email + Button only */}
        <div className="w-full max-w-md mx-auto mt-16">
          {/* Email Input */}
          <div className="mb-6">
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

          {/* Next Button */}
          <button className="w-80 max-sm:w-40 mx-auto block bg-blue-400 text-white py-2 rounded-4xl hover:bg-blue-500 transition mt-16">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
