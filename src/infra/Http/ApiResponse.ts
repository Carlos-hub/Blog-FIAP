import { Response } from 'express';
import { CustomError } from '../../Exceptions/Exceptions';

export interface ApiSuccess<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiFailure {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function respond<T>(res: Response, status: number, data: T, message?: string): Response<ApiResponse<T>> {
  return res.status(status).json({ success: true, data, message });
}

export function created<T>(res: Response, data: T, message?: string): Response<ApiResponse<T>> {
  return respond(res, 201, data, message);
}

export function ok<T>(res: Response, data: T, message?: string): Response<ApiResponse<T>> {
  return respond(res, 200, data, message);
}

export function noContent(res: Response): Response<void> {
  return res.status(204).send();
}

export function fail(res: Response, status: number, message: string, details?: unknown): Response<ApiFailure> {
  return res.status(status).json({ success: false, error: { message, details } });
}

export function handleError(res: Response, error: unknown): Response<ApiFailure> {
  if (error instanceof CustomError) {
    return fail(res, error.statusCode, error.message);
  }
  return fail(res, 500, 'Internal Server Error');
}

