export const AccountAPI = {
  login: "/LoginUser/Login",
  logout: "/Logout",
  register: "/SignUp",
  forgotPassword: "/Forgotpassword/forgot-password",
  verifyOTP: "/Forgotpassword/verify-otp",
  resetPassword: "/Forgotpassword/reset-password",
  getRole: "/GetRoles",
} as const;

export type AccountAPIKey = keyof typeof AccountAPI;
