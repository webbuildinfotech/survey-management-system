import React, { useRef } from "react";

const VerifyCode = () => {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value.length === 6 && /^[0-9]{6}$/.test(value)) {
      value.split("").forEach((digit, i) => {
        if (inputsRef.current[i]) {
          inputsRef.current[i].value = digit;
        }
      });
      inputsRef.current[5].focus();
      return;
    }

    if (/^[0-9]$/.test(value)) {
      inputsRef.current[index].value = value;
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="pt-10 max-sm:pt-6 bg-white font-sans pb-12 px-4">
      <div className="w-full max-w-lg mx-auto">
        {/* Heading */}
        <h2 className="text-2xl max-sm:text-xl font-bold text-center mb-2">
          Please Check your Email
        </h2>
        <p className="text-center font-semibold text-md max-sm:text-sm mb-6">
          We have sent the code to{" "}
          <span className="text-black font-bold break-words">
            Yourmail@gmail.com
          </span>
        </p>

        {/* Code Input */}
        <div className="flex justify-center gap-2 sm:gap-3 mt-10 flex-wrap">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={6}
              className="w-10 h-10 text-lg sm:text-xl text-center bg-[#F7F7F7] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button className="w-full sm:w-80 max-sm:w-40 mx-auto block bg-blue-400 text-white py-2 rounded-3xl hover:bg-blue-500 transition mt-10 text-sm sm:text-base mt-18">
          Next
        </button>
      </div>
    </div>
  );
};

export default VerifyCode;
