import { http } from "../../utils/axiosConfigs";
import type { ApiResponse } from "../../types/responseAxios.ts";
import { NotiAPI } from "./urls.tsx";

const getListNotifications = (param?: {
  pageIndex?: number;
  pageSize?: number;
}): Promise<
  ApiResponse<{
    notifications: Notification[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  }>
> =>
  http.get(NotiAPI.listNotifications, {
    params: {
      pageIndex: param?.pageIndex ?? 1,
      pageSize: param?.pageSize ?? 10,
    },
  });

const markAsRead = (
  notiId: string
): Promise<ApiResponse<null>> =>
  http.post(NotiAPI.markAsRead.replace("noti_id", notiId));

const markAllAsRead = (): Promise<ApiResponse<null>> =>
  http.post(NotiAPI.markAllAsRead);

const hasUnread = (): Promise<
  ApiResponse<{
    hasUnread: boolean;
  }>
> => http.get(NotiAPI.hasUnread);

const NotiServices = {
  getListNotifications,
  markAsRead,
  markAllAsRead,
  hasUnread,
};

export default NotiServices;
