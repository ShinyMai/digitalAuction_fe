export const AccountAPI = {
  login: "/account/login",
} as const;

export type AccountAPIKey = keyof typeof AccountAPI;
