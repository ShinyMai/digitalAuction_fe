export const AccountAPI = {
  login: "/LoginUser/Login",
  register: "/SignUp",
  forgotPassword: "account/forgot-password",
  verify: "/verify",
} as const;

export type AccountAPIKey = keyof typeof AccountAPI;
