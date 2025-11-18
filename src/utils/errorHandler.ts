import { ApiErrorResponse } from '@/types/api';

export function extractErrorMessage(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (!error) return fallback;

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object') {
    const maybeError = error as { status?: number; data?: ApiErrorResponse; error?: string };
    if (maybeError.data?.message) {
      return maybeError.data.message;
    }
    if (maybeError.error) {
      return maybeError.error;
    }
  }

  return fallback;
}
