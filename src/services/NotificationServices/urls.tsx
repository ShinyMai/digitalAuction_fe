export const NotiAPI = {
  listNotifications: "/Notifications",
} as const;

export type NotiAPIKey = keyof typeof NotiAPI;
