import ROUTERS from "./index";
import wrapWithLazy from "../utils/wrapWithLazy";
import React from "react";

// Import các component khác
const HomePage = React.lazy(
  () => import("../pages/Anonymous/HomePage/HomePage")
);

export const guestRoutes = [
  { path: ROUTERS.HOME, element: wrapWithLazy(HomePage) },
];
