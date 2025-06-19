import React from "react";

const CreatePost = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* बैकड्रॉप */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* मोडल कंटेंट */}
      <div className="relative bg-white rounded-lg w-64">
        <div className="flex flex-col divide-y">
          <button 
            className="w-full py-3 text-center hover:bg-gray-100"
            onClick={() => {/* Question का लॉजिक */}}
          >
            Question
          </button>
          
          <button 
            className="w-full py-3 text-center hover:bg-gray-100"
            onClick={() => {/* Post का लॉजिक */}}
          >
            Post
          </button>
          
          <button 
            className="w-full py-3 text-center hover:bg-gray-100"
            onClick={() => {/* Review का लॉजिक */}}
          >
            Review
          </button>
          
          <button 
            className="w-full py-3 text-center hover:bg-gray-100"
            onClick={() => {/* Poll का लॉजिक */}}
          >
            Poll
          </button>
          
          <button 
            className="w-full py-3 text-center text-red-500 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
