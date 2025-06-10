export const VNPTAPI = {
  uploadImage: "/file-service/v1/addFile",
} as const;

export type VNPTAPIKey = keyof typeof VNPTAPI;
