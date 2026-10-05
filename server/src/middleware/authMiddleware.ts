import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      auth?: { userId: string };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authorization = req.get('Authorization');
  const token = authorization?.match(/^Bearer\s+(\S+)$/i)?.[1];

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication token required' });
    return;
  }

  let decoded: string | jwt.JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }

  if (typeof decoded === 'string' || typeof decoded.sub !== 'string') {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
    return;
  }

  req.auth = { userId: decoded.sub };
  next();
};
