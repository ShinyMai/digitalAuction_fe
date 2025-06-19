export const GUEST_ROUTERS = {
  HOME: "",
  LOGIN: "login",
  REGISTER: "register",
  TIN_TUC: "tin-tuc",
  NOT_FOUND: "not-found",
  AUCITON_LIST: 'auction-list',
  AUCTION_DETAIL: 'auction-detail'
};

export const USER_ROUTERS = {
  PATH: "user",
  SUB: {
    ...GUEST_ROUTERS,
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
