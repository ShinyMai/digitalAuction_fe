/* eslint-disable @typescript-eslint/no-explicit-any */
import { http } from "../../utils/axiosConfigs";
import type { ApiResponse } from "../../types/responseAxios.ts";
import { UserAPI } from "./urls.tsx";

const getUserInfo = (param: {
  user_id: string;
}): Promise<
  ApiResponse<{
    citizenIdentification?: string;
    name?: string;
    birthDay?: string;
    nationality?: string;
    gender?: string;
    validDate?: string;
    originLocation?: string;
    recentLocation?: string;
    issueDate?: string;
    issueBy?: string;
    email?: string;
    phoneNumber?: string;
    roleName?: string;
  }>
> => http.get(UserAPI.userProfile.replace("{user_id}", param.user_id));

const sendPasswordToUser = (body: any): Promise<ApiResponse> =>
  http.post(UserAPI.SEND_PASSWORD_TO_USER, body);

const getUserByCccd = (citizenIdentification: string): Promise<ApiResponse> =>
  http.get(
    UserAPI.GET_USER_BY_CCCD.replace(
      "{citizenIdentification}",
      citizenIdentification
    )
  );

const getNumbericalOrder = (
  auctionId: string,
  citizenIdentification: string
): Promise<ApiResponse> =>
  http.get(
    UserAPI.GET_NUMBERICAL_ORDER.replace("{auctionId}", auctionId).replace(
      "{citizenIdentification}",
      citizenIdentification
    )
  );

const getListCustomer = (params: any): Promise<ApiResponse> =>
  http.get(UserAPI.LIST_CUSTOMER, { params: params });

const UserServices = {
  getUserInfo,
  sendPasswordToUser,
  getUserByCccd,
  getNumbericalOrder,
  getListCustomer,
};

export default UserServices;
