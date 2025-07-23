// backend/src/types/api.types.ts
export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
  }
  