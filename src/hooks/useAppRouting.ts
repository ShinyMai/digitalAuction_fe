import { useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  guestRoutes,
  staffRoutes,
  userRoutes,
} from "../routers/roleBased.routes";

const USER_ROLES = {
  USER: "Customer",
  ADMIN: "Admin",
  STAFF: "Staff",
  AUCTIONEER: "Auctioneer",
  MANAGER: "Manager",
  DIRECTOR: "Director",
} as const;

type UserRole =
  (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const useAppRouting = () => {
  const { user } = useSelector(
    (state: RootState) => state.auth
  );
  const role = user?.roleName as UserRole | undefined;

  const userAndGuestRoutes = useMemo(
    () => [...userRoutes, ...guestRoutes],
    []
  );

  const isUserOrGuest = role === USER_ROLES.USER || !role;
  const isCompanyStaff = role !== USER_ROLES.USER;
  const isAdmin = role === USER_ROLES.ADMIN;
  const isStaff = role === USER_ROLES.STAFF;
  const isAuctioneer = role === USER_ROLES.AUCTIONEER;
  const isManager = role === USER_ROLES.MANAGER;
  const isDirector = role === USER_ROLES.DIRECTOR;

  return {
    role,
    userAndGuestRoutes,
    staffRoutes,
    isUserOrGuest,
    isCompanyStaff,
    isAdmin,
    isStaff,
    isAuctioneer,
    isManager,
    isDirector,
    USER_ROLES,
  };
};
