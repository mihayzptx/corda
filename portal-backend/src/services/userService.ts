import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

export interface User {
  id: string;
  email: string;
  full_name: string;
  company_name?: string;
  role: 'customer' | 'corda_admin';
  created_at: string;
  last_login?: string;
}

function isValidPassword(password: string): boolean {
  if (password.length < 12) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
  return true;
}

export async function createUserFromInvite(
  email: string,
  password: string,
  fullName: string,
  companyName: string,
  inviteCode: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  if (!isValidPassword(password)) {
    throw new ValidationError('Password must be at least 12 characters with uppercase, lowercase, number, and symbol');
  }

  const inviteResult = await pool.query(
    'SELECT * FROM invites WHERE code = $1 AND used = FALSE AND expires_at > NOW()',
    [inviteCode]
  );

  if (inviteResult.rows.length === 0) {
    throw new ValidationError('Invalid or expired invite code');
  }

  const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new ValidationError('Email already registered');
  }

  const userId = uuidv4();
  const passwordHash = await hashPassword(password);

  try {
    await pool.query('BEGIN');

    await pool.query(
      `INSERT INTO users (id, email, password_hash, full_name, company_name, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, email, passwordHash, fullName, companyName, 'customer']
    );

    await pool.query(
      'UPDATE invites SET used = TRUE, used_by = $1 WHERE code = $2',
      [userId, inviteCode]
    );

    await pool.query('COMMIT');

    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    return {
      user: {
        id: userId,
        email,
        full_name: fullName,
        company_name: companyName,
        role: 'customer',
        created_at: new Date().toISOString(),
      },
      accessToken,
      refreshToken,
    };
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; accessToken: string; refreshToken: string }> {
  const result = await pool.query(
    'SELECT id, email, password_hash, full_name, company_name, role, last_login FROM users WHERE email = $1',
    [email]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Invalid email or password');
  }

  const user = result.rows[0];
  const isValid = await comparePassword(password, user.password_hash);

  if (!isValid) {
    throw new NotFoundError('Invalid email or password');
  }

  await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      company_name: user.company_name,
      role: user.role,
      created_at: user.created_at,
      last_login: user.last_login,
    },
    accessToken,
    refreshToken,
  };
}

export async function getUserById(userId: string): Promise<User> {
  const result = await pool.query('SELECT id, email, full_name, company_name, role, created_at, last_login FROM users WHERE id = $1', [userId]);

  if (result.rows.length === 0) {
    throw new NotFoundError('User not found');
  }

  return result.rows[0];
}
