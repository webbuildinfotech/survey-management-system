import React from "react";

const CreateModal = ({ onClose }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 min-w-[250px]">
    <ul>
      <li className="py-2 border-b cursor-pointer hover:bg-gray-100">Question</li>
      <li className="py-2 border-b cursor-pointer hover:bg-gray-100">Post</li>
      <li className="py-2 border-b cursor-pointer hover:bg-gray-100">Review</li>
      <li className="py-2 border-b cursor-pointer hover:bg-gray-100">Poll</li>
      <li
        className="py-2 text-red-500 cursor-pointer hover:bg-gray-100"
        onClick={onClose}
      >
        Cancel
      </li>
    </ul>
  </div>
);

export default CreateModal;
