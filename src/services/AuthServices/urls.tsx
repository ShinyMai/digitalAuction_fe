export const AccountAPI = {
  login: "/LoginUser/Login",
  logout: "/Logout",
  register: "/SignUp",
  forgotPassword: "/Forgotpassword/forgot-password",
  verifyOTP: "/Forgotpassword/verify-otp",
  resetPassword: "/Forgotpassword/reset-password",
  getRole: "/GetRoles",
  updateAccount: "/UpdateAccount/Send-Update-Otp",
  verifyUpdateAccountOTP: "/UpdateAccount/Verify-Otp-And-Update",
  updateExpiredProfile: "/UpdateExpiredProfile/Update-Expired-Profile",
  listAccount: "/EmployeeManager/List-Employee-Account",
  chanegeStatusAccount: "/EmployeeManager/Change-Status-Employee-Account",
  assignRole: "/EmployeeManager/Assign-Permission-User",
} as const;

export type AccountAPIKey = keyof typeof AccountAPI;
