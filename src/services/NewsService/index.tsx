/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ApiResponse } from "../../types/responseAxios";
import { http } from "../../utils/axiosConfigs";
import { NewsAPI } from "./urls.tsx";

const getListNews = (params?: any): Promise<ApiResponse<any>> =>
  http.get(NewsAPI.GET_LIST_NEWS, { params: params });

const NewsServices = {
  getListNews,
};

export default NewsServices;
