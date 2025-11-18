export interface ApiListResponse<T> {
  items: T[];
  total: number;
}

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
