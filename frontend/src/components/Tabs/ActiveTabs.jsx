// src/components/Tabs/Tabs.jsx
import React from "react";
import { useIsMobile } from "../../hooks/useIsMobile";

const TabsComponent = ({ tabs, activeTab, setActiveTab }) => {

  const isMobile = useIsMobile();


  return (
    <div className="flex items-center gap-14 mt-8 max-md:mt-2">
        {tabs.filter(tab => (!isMobile && tab.name !== "Tag") || (isMobile && tab.name !== "Tagged")).map((tab, index) => (

        <button
          key={tab.name}
          onClick={() => setActiveTab(tab.name)}
          className={`flex items-center gap-2 py-2 px-1 text-sm font-medium border-b-2 transition-all
            ${
              activeTab === tab.name
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-400 hover:text-blue-500"
            }`}
        >
          <span
            className={`size-6 ${
              activeTab === tab.name ? "text-blue-500" : "text-gray-400"
            }`}
          >
            {tab.icon}
          </span>
          <span className="max-sm:hidden font-semibold text-base">
            {tab.name}
          </span>
        </button>
      ))}
    </div>
  );
};

export default TabsComponent;
