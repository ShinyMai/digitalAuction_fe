export const NotiAPI = {
  listNotifications: "/Notifications",
  markAsRead: "/Notifications/noti_id/MarkAsRead",
  markAllAsRead: "/Notifications/MarkAllAsRead",
  hasUnread: "Notifications/has-unread",
} as const;

export type NotiAPIKey = keyof typeof NotiAPI;
