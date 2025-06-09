import ROUTERS from "./index";
import wrapWithLazy from "../utils/wrapWithLazy";
import React from "react";

// Import các component khác
const HomePage = React.lazy(
  () => import("../pages/Anonymous/HomePage/HomePage")
);
const News = React.lazy(
  () => import("../pages/Anonymous/News/News")
);

export const guestRoutes = [
  { path: ROUTERS.HOME, element: wrapWithLazy(HomePage) },
  { path: ROUTERS.TIN_TUC, element: wrapWithLazy(News) },
];
