import {
  ADMIN_ROUTES,
  GUEST_ROUTERS,
  STAFF_ROUTES,
  USER_ROUTERS,
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
const NotFound = React.lazy(
  () => import("../components/Common/NotFound/index")
);

export const guestRoutes = [
  {
    path: GUEST_ROUTERS.HOME,
    element: wrapWithLazy(HomePage),
  },
  {
    path: GUEST_ROUTERS.REGISTER,
    element: wrapWithLazy(Register),
  },
  {
    path: GUEST_ROUTERS.TIN_TUC,
    element: wrapWithLazy(News),
  },
  {
    path: GUEST_ROUTERS.NOT_FOUND,
    element: wrapWithLazy(NotFound),
  },
];

// Router site User
export const userRoutes = [
  {
    path: USER_ROUTERS.SUB.HOME,
    element: wrapWithLazy(HomePage),
  },
  {
    path: GUEST_ROUTERS.NOT_FOUND,
    element: wrapWithLazy(NotFound),
  },
];

// Router site TuanLinh
const PostAuction = React.lazy(
  () => import("../pages/Staff/PostAuction/index")
);

const AuctionList = React.lazy(
  () => import("../pages/Staff/AuctionList/index")
);

const AuctionDetail = React.lazy(
  () => import("../pages/Staff/AuctionDetail/index")
);

// Placeholder components for missing routes
const Statistics = React.lazy(() =>
  Promise.resolve({
    default: () => <div>Statistics Page - Coming Soon</div>,
  })
);

const Properties = React.lazy(() =>
  Promise.resolve({
    default: () => <div>Properties Page - Coming Soon</div>,
  })
);

const Personnel = React.lazy(() =>
  Promise.resolve({
    default: () => <div>Personnel Page - Coming Soon</div>,
  })
);

const Dashboard = React.lazy(() =>
  Promise.resolve({
    default: () => <div>Dashboard Page - Coming Soon</div>,
  })
);

export const staffRoutes = [
  {
    path: STAFF_ROUTES.SUB.POST_AUCTION,
    element: wrapWithLazy(PostAuction),
  },
  {
    path: STAFF_ROUTES.SUB.AUCTION_LIST,
    element: wrapWithLazy(AuctionList),
  },
  {
    path: STAFF_ROUTES.SUB.DASHBOARD,
    element: wrapWithLazy(Dashboard),
  },
  {
    path: STAFF_ROUTES.SUB.STATISTICS,
    element: wrapWithLazy(Statistics),
  },
  {
    path: STAFF_ROUTES.SUB.PROPERTIES,
    element: wrapWithLazy(Properties),
  },
  {
    path: STAFF_ROUTES.SUB.PERSONNEL,
    element: wrapWithLazy(Personnel),
  },
  {
    path: STAFF_ROUTES.SUB.AUCTION_DETAIL,
    element: wrapWithLazy(AuctionDetail),
  },

  {
    path: GUEST_ROUTERS.NOT_FOUND,
    element: wrapWithLazy(NotFound),
  },
];

// Router site Admin
const AddAccountStaff = React.lazy(
  () => import("../pages/Admin/ManagerAccount/AddEmployees")
);

export const adminRoutes = [
  {
    path: ADMIN_ROUTES.SUB.ADD_EMPLOYEES,
    element: wrapWithLazy(AddAccountStaff),
  },
  {
    path: ADMIN_ROUTES.SUB.DASHBOARD,
    element: wrapWithLazy(Dashboard),
  },
];
