import { Router, Request, Response, NextFunction } from 'express';
import { loginUser, createUserFromInvite } from '../services/userService';
import { authenticateToken } from '../middleware/auth';
import { ValidationError, RateLimitError } from '../middleware/errorHandler';
import { generateAccessToken } from '../utils/jwt';

const router = Router();
const loginAttempts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(email: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(email);

  if (attempt && attempt.resetTime > now) {
    if (attempt.count >= 5) {
      throw new RateLimitError('Too many login attempts. Try again in 15 minutes.');
    }
    attempt.count++;
  } else {
    loginAttempts.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 });
  }
}

router.post('/auth/invite-accept', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, email, password, fullName, companyName } = req.body;

    if (!code || !email || !password || !fullName) {
      throw new ValidationError('Missing required fields: code, email, password, fullName');
    }

    const { user, accessToken, refreshToken } = await createUserFromInvite(
      email,
      password,
      fullName,
      companyName || '',
      code
    );

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 90 * 24 * 60 * 60 * 1000 });

    res.json({
      user,
      access_token: accessToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError('Missing required fields: email, password');
    }

    checkRateLimit(email);

    const { user, accessToken, refreshToken } = await loginUser(email, password);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 90 * 24 * 60 * 60 * 1000 });

    res.json({
      user,
      access_token: accessToken,
    });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/refresh', (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      throw new ValidationError('Missing refresh_token');
    }

    const accessToken = generateAccessToken('userId-placeholder');

    res.json({ access_token: accessToken });
  } catch (err) {
    next(err);
  }
});

router.post('/auth/logout', authenticateToken, (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ success: true });
});

export default router;
