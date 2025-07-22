import {
  ADMIN_ROUTES,
  AUCTIONEER_ROUTES,
  GUEST_ROUTERS,
  MANAGER_ROUTES,
  STAFF_ROUTES,
  USER_ROUTERS,
} from ".";
import wrapWithLazy from "../utils/wrapWithLazy";
import React from "react";

const HomePage = React.lazy(() => import("../pages/Anonymous/HomePage/HomePage"));
const Introduction = React.lazy(() => import("../pages/Anonymous/Introduction/Introduction"));
const Register = React.lazy(() => import("../pages/Anonymous/Register/Register"));
const News = React.lazy(() => import("../pages/Anonymous/News/News"));
const Guidance = React.lazy(() => import("../pages/Anonymous/Guidance/Guidance"));
const AuctionResultsAnonymous = React.lazy(
  () => import("../pages/Anonymous/ResultAuction/ResultAuction")
);
const NotFound = React.lazy(() => import("../components/Common/NotFound/index"));
const AuctionListAnonymous = React.lazy(() => import("../pages/Anonymous/AuctionList/index"));
const AuctionDetailAnonymous = React.lazy(() => import("../pages/Anonymous/AuctionDetail/index"));

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
    path: GUEST_ROUTERS.INTRODUCTION,
    element: wrapWithLazy(Introduction),
  },
  {
    path: GUEST_ROUTERS.TIN_TUC,
    element: wrapWithLazy(News),
  },
  {
    path: GUEST_ROUTERS.GUIDANCE,
    element: wrapWithLazy(Guidance),
  },
  {
    path: GUEST_ROUTERS.NOT_FOUND,
    element: wrapWithLazy(NotFound),
  },
  {
    path: GUEST_ROUTERS.AUCTION_LIST,
    element: wrapWithLazy(AuctionListAnonymous),
  },
  {
    path:
      GUEST_ROUTERS.AUCTION_LIST + "/" + GUEST_ROUTERS.AUCTION_DETAIL ||
      GUEST_ROUTERS.AUCTION_DETAIL,
    element: wrapWithLazy(AuctionDetailAnonymous),
  },
  {
    path: GUEST_ROUTERS.AUCTION_RESULTS,
    element: wrapWithLazy(AuctionResultsAnonymous),
  },
];

// Router site User
const AuctionRegister = React.lazy(() => import("../pages/User/AuctionRegister/index"));
const RegistedAuction = React.lazy(() => import("../pages/User/RegistedAuction/RegistedAuction"));
const RegistedAuctionDetail = React.lazy(
  () => import("../pages/User/RegistedAuctionDetail/RegistedAuctionDetail")
);

export const userRoutes = [
  {
    path: USER_ROUTERS.SUB.HOME,
    element: wrapWithLazy(HomePage),
  },
  {
    path: GUEST_ROUTERS.NOT_FOUND,
    element: wrapWithLazy(NotFound),
  },
  {
    path:
      GUEST_ROUTERS.AUCTION_LIST +
      "/" +
      GUEST_ROUTERS.AUCTION_DETAIL +
      "/" +
      USER_ROUTERS.SUB.AUCTION_REGISTER,
    element: wrapWithLazy(AuctionRegister),
  },
  {
    path: USER_ROUTERS.SUB.REGISTED_AUCTION,
    element: wrapWithLazy(RegistedAuction),
  },
  {
    path: USER_ROUTERS.SUB.REGISTED_AUCTION_DETAIL + "/:id",
    element: wrapWithLazy(RegistedAuctionDetail),
  },
];

// Router site TuanLinh
const PostAuction = React.lazy(() => import("../pages/Staff/PostAuction/index"));

const AuctionList = React.lazy(() => import("../pages/Staff/AuctionList/index"));

const AuctionListDraff = React.lazy(() => import("../pages/Manager/AutionListDraff/index"));

const AuctionDetail = React.lazy(() => import("../pages/Staff/AuctionDetail/index"));

const AuctionDetailAuctioneer = React.lazy(() => import("../pages/Auctioneer/AuctionDetail/index"));

const AuctionListCancel = React.lazy(() => import("../pages/Manager/AuctionListCancel/index"));

const AuctionDetailCancel = React.lazy(() => import("../pages/Manager/AuctionDetailCancel/index"));

const AuctionDetailDraff = React.lazy(() => import("../pages/Manager/AuctionDraffDetail/index"));

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

const SupportRegisterAuction = React.lazy(
  () => import("../pages/Staff/SupportRegisterAuction/index")
);

const listAcutionNow = React.lazy(() => import("../pages/Auctioneer/ListAuctionNow/index"));

const ListAuctionAssigned = React.lazy(() =>
  import("../pages/Auctioneer/ListAuctionAssigned/index"))

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
    path: STAFF_ROUTES.SUB.AUCTION_LIST_DRAFF,
    element: wrapWithLazy(AuctionListDraff),
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
    path: STAFF_ROUTES.SUB.SUPPORT_REGISTER_AUCTION,
    element: wrapWithLazy(SupportRegisterAuction),
  },
  {
    path: GUEST_ROUTERS.NOT_FOUND,
    element: wrapWithLazy(NotFound),
  },
  {
    path: AUCTIONEER_ROUTES.SUB.AUCTION_NOW,
    element: wrapWithLazy(listAcutionNow),
  },
  {
    path: STAFF_ROUTES.SUB.AUCTION_NOW + "/" + STAFF_ROUTES.SUB.AUCTION_DETAIL_NOW,
    element: wrapWithLazy(AuctionDetailAuctioneer),
  },
  {
    path: MANAGER_ROUTES.SUB.AUCTION_LIST_CANCEL,
    element: wrapWithLazy(AuctionListCancel),
  },
  {
    path: MANAGER_ROUTES.SUB.AUCTION_LIST_CANCEL + "/" + MANAGER_ROUTES.SUB.AUCTION_DETAIL_CANCEL,
    element: wrapWithLazy(AuctionDetailCancel),
  },
  {
    path: STAFF_ROUTES.SUB.AUCTION_LIST_DRAFF + "/" + STAFF_ROUTES.SUB.AUCTION_DETAIL_DRAFF,
    element: wrapWithLazy(AuctionDetailDraff),
  },
];

// Router site Admin
const AddAccountStaff = React.lazy(() => import("../pages/Admin/ManagerAccount/AddEmployees"));

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

export const managerRoutes = [
  ...staffRoutes,
  {
    path: MANAGER_ROUTES.SUB.AUCTION_LIST_CANCEL,
    element: wrapWithLazy(AuctionListCancel),
  },
  {
    path: MANAGER_ROUTES.SUB.AUCTION_LIST_CANCEL + "/" + MANAGER_ROUTES.SUB.AUCTION_DETAIL_CANCEL,
    element: wrapWithLazy(AuctionDetailCancel),
  },
];

export const auctioneerRoutes = [
  {
    path: AUCTIONEER_ROUTES.SUB.AUCTION_NOW,
    element: wrapWithLazy(listAcutionNow),
  },
  {
    path: AUCTIONEER_ROUTES.SUB.AUCTION_NOW + "/" + AUCTIONEER_ROUTES.SUB.AUCTION_DETAIL_NOW,
    element: wrapWithLazy(AuctionDetailAuctioneer),
  },
  {
    path: AUCTIONEER_ROUTES.SUB.LIST_AUCTION_ASSIGNED,
    element: wrapWithLazy(ListAuctionAssigned),
  }
];
