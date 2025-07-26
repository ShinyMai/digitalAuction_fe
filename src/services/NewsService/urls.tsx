export const NewsAPI = {
  GET_LIST_NEWS: "/Blog/Get-List-Blog",
} as const;

export type NewsAPIKey = keyof typeof NewsAPI;
