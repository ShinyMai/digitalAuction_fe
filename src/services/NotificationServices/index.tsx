import http from "../../utils/axiosConfigs";
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

const NotiServices = {
  getListNotifications,
};

export default NotiServices;
