import { Request, Response, NextFunction } from 'express'

export interface APIError extends Error {
  statusCode?: number
  code?: string
}

export const errorHandler = (
  error: APIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('API Error:', error)

  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'
  const code = error.code || 'INTERNAL_ERROR'

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    }
  })
}

export const createError = (message: string, statusCode: number = 500, code?: string): APIError => {
  const error = new Error(message) as APIError
  error.statusCode = statusCode
  error.code = code
  return error
}