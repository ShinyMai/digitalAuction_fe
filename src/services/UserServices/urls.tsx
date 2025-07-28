export const UserAPI = {
  userProfile: "/UserInfo/{user_id}",
  SEND_PASSWORD_TO_USER: "/SendMessage",
} as const;

export type UserAPIKey = keyof typeof UserAPI;
