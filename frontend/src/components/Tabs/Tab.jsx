import React from "react";

import { TiThMenuOutline } from "react-icons/ti";
import { CgMenuLeft } from "react-icons/cg";
import { CiBookmark } from "react-icons/ci";
import { SlUserFollowing } from "react-icons/sl";

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
      icon: <SlUserFollowing className="max-sm:text-2xl" size={26} />,
    },
    {
      name: "Collection",
      icon: <CiBookmark className="max-sm:text-2xl" size={26} />,
    },
  ];