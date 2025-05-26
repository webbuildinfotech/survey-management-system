import React from "react";

import { TiThMenuOutline } from "react-icons/ti";
import { CgMenuLeft } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { FiBookmark } from "react-icons/fi";
import { SlUserFollowing } from "react-icons/sl";
import { CiAt } from "react-icons/ci";
export const Tabs = [
  {
    name: "Activity",
    icon: <TiThMenuOutline className="max-sm:text-2xl" size={26} />,
  },
  {
    name: "Polls",
    icon: <CgMenuLeft className="max-sm:text-2xl" size={26} />,
  },
  {
    name: "Tagged",
    icon: <SlUserFollowing className="hidden max-sm:hidden text-2xl sm:inline" size={26} />,
  },
  {
    name: "Collection",
    icon: <FiBookmark className="max-sm:text-2xl" size={26} />,
  },
  {
    name: "Tag",
    icon: <CiAt className="max-sm:text-2xl" size={26} />,
  },
];
