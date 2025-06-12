import { ROUTERCOMPANY, ROUTERS } from ".";
import wrapWithLazy from "../utils/wrapWithLazy";
import React from "react";

// Import các component khác
const HomePage = React.lazy(
  () => import("../pages/Anonymous/HomePage/HomePage")
);
const Register = React.lazy(
  () => import("../pages/Anonymous/Register/Register")
);
const News = React.lazy(
  () => import("../pages/Anonymous/News/News")
);

export const guestRoutes = [
  {
    path: ROUTERS.SUB.HOME,
    element: wrapWithLazy(HomePage),
  },
  {
    path: ROUTERS.SUB.REGISTER,
    element: wrapWithLazy(Register),
  },
  {
    path: ROUTERS.SUB.TIN_TUC,
    element: wrapWithLazy(News),
  },
];

// Router site TuanLinh

const PostAuction = React.lazy(
  () => import("../pages/Company/PostAuction/index")
);

export const companyRoutes = [
  {
    path: ROUTERCOMPANY.SUB.POST_AUCTION,
    element: wrapWithLazy(PostAuction),
  },
];
