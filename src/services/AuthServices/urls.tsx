export const AccountAPI = {
  login: "account/login",
  register: "/SignUp",
} as const;

export type AccountAPIKey = keyof typeof AccountAPI;
