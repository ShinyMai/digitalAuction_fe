export interface ApiResponse<T = object> {
  code: number;
  message: string;
  data: T;
}
