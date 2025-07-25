export const GUEST_ROUTERS = {
  HOME: "",
  LOGIN: "login",
  REGISTER: "register",
  INTRODUCTION: "introduction",
  TIN_TUC: "news",
  GUIDANCE: "guidance",
  NOT_FOUND: "not-found",
  AUCTION_LIST: "auction-list",
  AUCTION_DETAIL: "auction-detail",
  AUCTION_RESULTS: "auction-results",
};

export const USER_ROUTERS = {
  PATH: "customer",
  SUB: {
    ...GUEST_ROUTERS,
    AUCTION_REGISTER: "auction-register",
    REGISTED_AUCTION: "registed-auction",
    AUCTION_DETAIL_REGISTER: "auction-detail-register",
    REGISTED_AUCTION_DETAIL: "registed-auction-detail",
  },
};

export const STAFF_ROUTES = {
  PATH: "staff",
  SUB: {
    DASHBOARD: "dashboard",
    POST_AUCTION: "post-auction",
    AUCTION_LIST: "auction-list",
    STATISTICS: "statistics",
    PROPERTIES: "properties",
    PERSONNEL: "personnel",
    AUCTION_DETAIL: "auction-detail",
    NOT_FOUND: "not-found",
    AUCTION_LIST_DRAFF: "auction-list-draff",
    AUCTION_DETAIL_DRAFF: "auction-detail-draff",
    SUPPORT_REGISTER_AUCTION: "support-register-auction",
    AUCTION_NOW: "auction_now",
    AUCTION_DETAIL_NOW: "auction-detail-now",
  },
};

export const ADMIN_ROUTES = {
  PATH: "admin",
  SUB: {
    DASHBOARD: "dashboard",
    MANAGER_ACCOUNT: "manager-account",
    ADD_EMPLOYEES: "add-employees",
  },
};

export const AUCTIONEER_ROUTES = {
  PATH: "auctioneer",
  SUB: {
    AUCTION_NOW: "auction_now",
    AUCTION_DETAIL_NOW: "auction-detail-now",
    LIST_AUCTION_ASSIGNED: "list-auction-assigned",
    DASHBOARD: "dashboard",
    AUCTION_ROUNDS: "auction-rounds",
    AUCTION_ROUND_DETAIL: "auction-round-detail",
  },
};

export const MANAGER_ROUTES = {
  PATH: "manager",
  SUB: {
    AUCTION_LIST_CANCEL: "auction-list-cancel",
    AUCTION_DETAIL_CANCEL: "auction-detail-cancel",
  },
};
