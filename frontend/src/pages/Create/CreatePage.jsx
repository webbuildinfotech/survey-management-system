import React, { useState } from "react";

const CreatePage = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="relative h-full">
      {showModal && (
        <div className="absolute inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      
        </div>
      )}
    </div>
  );
};

export default CreatePage;
