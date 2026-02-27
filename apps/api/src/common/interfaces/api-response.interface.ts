export interface ApiResponse<T> {
  status: 'success' | 'error' | 'db-offline';
  data?: T;
  message?: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
}
