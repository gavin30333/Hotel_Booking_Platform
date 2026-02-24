import { Request, Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'hotel_booking_secret_key_2024'
const JWT_EXPIRES_IN = '7d'

export interface JwtPayload {
  customerId: string
  phone: string
  iat: number
  exp: number
}

export interface AuthRequest extends Request {
  customer?: JwtPayload
}

export const generateToken = (customerId: string, phone: string): string => {
  return jwt.sign({ customerId, phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未登录或token过期',
      code: 'UNAUTHORIZED',
    })
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: '未登录或token过期',
      code: 'UNAUTHORIZED',
    })
  }

  req.customer = decoded
  next()
}

export default authMiddleware
