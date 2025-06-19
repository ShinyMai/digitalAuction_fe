export const UserAPI = {
  userProfile: "/UserInfo/{user_id}",
} as const;

export type UserAPIKey = keyof typeof UserAPI;
