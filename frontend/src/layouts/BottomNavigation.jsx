// frontend/src/components/Navigation/BottomNavigation.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { LuSquarePlus } from "react-icons/lu";
import { BsSearch } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi";

const navigationItems = [
  {
    to: "/",
    icon: GoHome,
    label: "Home"
  },
  {
    to: "/search",
    icon: BsSearch,
    label: "Search"
  },
  {
    to: "/create",
    icon: LuSquarePlus,
    label: "Create"
  },
  {
    to: "/profile",
    icon: HiOutlineUser,
    label: "Profile"
  }
];

const NavItem = ({ to, Icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive
        ? "flex-1 flex flex-col items-center py-2 text-blue-500"
        : "flex-1 flex flex-col items-center py-2"
    }
  >
    <Icon className="size-6" />
    <span className="text-sm">{label}</span>
  </NavLink>
);

const BottomNavigation = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl md:hidden z-50 px-0 py-1 shadow-[0_-4px_15px_rgba(0,0,0,0.30)]">
      <nav className="flex justify-between">
        {navigationItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            Icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;