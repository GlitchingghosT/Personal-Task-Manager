import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const createToken = (userId: string): string => jwt.sign(
  {},
  process.env.JWT_SECRET as string,
  { subject: userId, expiresIn: '1h' }
);

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const register = async (req: Request, res: Response): Promise<void> => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: 'A JSON object is required' });
    return;
  }

  const { email, password } = req.body;
  if (typeof email !== 'string' || !isValidEmail(email.trim()) ||
      typeof password !== 'string' || password.length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72) {
    res.status(400).json({
      success: false,
      message: 'Provide a valid email and a password of at least 8 characters and no more than 72 UTF-8 bytes',
    });
    return;
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email: normalizedEmail, passwordHash });
    res.status(201).json({
      success: true,
      data: { id: user.id, email: user.email, token: createToken(user.id) },
    });
  } catch (error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      res.status(409).json({ success: false, message: 'An account with this email already exists' });
      return;
    }
    console.error('Registration failed:', error);
    res.status(500).json({ success: false, message: 'Unable to register user' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
    res.status(400).json({ success: false, message: 'A JSON object is required' });
    return;
  }

  const { email, password } = req.body;
  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }
  if (Buffer.byteLength(password, 'utf8') > 72) {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
    return;
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    res.status(200).json({
      success: true,
      data: { id: user.id, email: user.email, token: createToken(user.id) },
    });
  } catch (error: unknown) {
    console.error('Login failed:', error);
    res.status(500).json({ success: false, message: 'Unable to log in' });
  }
};
