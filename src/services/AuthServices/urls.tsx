export const AccountAPI = {
    login: "account/login",
    register: "register",
} as const;

export type AccountAPIKey = keyof typeof AccountAPI;
