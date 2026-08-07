import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_EXPIRES = '30d';
const REFRESH_TOKEN_EXPIRES = '90d';

export interface TokenPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export function generateAccessToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'dev-secret-change-in-prod',
    { expiresIn: ACCESS_TOKEN_EXPIRES }
  );
}

export function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret-change-in-prod',
    { expiresIn: REFRESH_TOKEN_EXPIRES }
  );
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET || 'dev-secret-change-in-prod'
    ) as TokenPayload;
  } catch (err) {
    throw new Error('Invalid access token');
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret-change-in-prod'
    ) as TokenPayload;
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
}
