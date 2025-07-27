export const NewsAPI = {
  GET_LIST_NEWS: "/Blog/Get-List-Blog",
  DETAIL_BLOG: "/Blog/Get-Blog-Detail",
  CREATE_BLOG: "/Blog/Create-Blog",
  UPDATE_BLOG: "/Blog/Update-Blog",
  CHANGE_STATUS_BLOG: "/Blog/Change-Status-Blog",
} as const;

export type NewsAPIKey = keyof typeof NewsAPI;
