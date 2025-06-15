import {
  GUESTROUTERS,
  ROUTERCOMPANY,
  USERROUTERS,
} from ".";
import wrapWithLazy from "../utils/wrapWithLazy";
import React from "react";

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
    path: GUESTROUTERS.SUB.HOME,
    element: wrapWithLazy(HomePage),
  },
  {
    path: GUESTROUTERS.SUB.REGISTER,
    element: wrapWithLazy(Register),
  },
  {
    path: GUESTROUTERS.SUB.TIN_TUC,
    element: wrapWithLazy(News),
  },
];

// Router site User

export const userRoutes = [
  {
    path: USERROUTERS.SUB.HOME,
    element: wrapWithLazy(HomePage),
  },
];

// Router site TuanLinh

const PostAuction = React.lazy(
  () => import("../pages/Company/PostAuction/index")
);

const AuctionList = React.lazy(
  () => import("../pages/Company/AuctionList/index")
)

export const companyRoutes = [
  { path: ROUTERCOMPANY.SUB.POST_AUCTION, element: wrapWithLazy(PostAuction) },
  { path: ROUTERCOMPANY.SUB.AUCTION_LIST, element: wrapWithLazy(AuctionList) }
]
