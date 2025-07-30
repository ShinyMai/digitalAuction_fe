export const UserAPI = {
  userProfile: "/UserInfo/{user_id}",
  SEND_PASSWORD_TO_USER: "/SendMessage",
  GET_USER_BY_CCCD:
    "AuctionDocuments/user-by-citizen-identification?citizenIdentification={citizenIdentification}",
} as const;

export type UserAPIKey = keyof typeof UserAPI;
