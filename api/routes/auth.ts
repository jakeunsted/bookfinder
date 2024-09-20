import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import { RefreshToken } from '../database/models/refreshToken.model.ts';
import { 
  createRefreshToken,
  verifyPassword,
  findRefreshToken,
  deleteRefreshToken 
} from '../database/services/user.service.ts';

const router = express.Router();

interface ValidUser {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface TokenPayload {
  id: number;
}

/**
 * Login route to generate JWT
 */
router.post(
  '/login',
  body('username').isString().withMessage('Username is required'),
  body('password').isString().withMessage('Password is required'),
  async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    try {
      const validatedUser: ValidUser | null = await verifyPassword(
        username, password
      );
      if (!validatedUser) {
        throw new Error('Invalid credentials');
      }
      const payload: TokenPayload = { id: validatedUser.id };
      const accessToken: string = passportConfig.generateAccessToken(payload);
      const refreshToken: string = passportConfig.generateRefreshToken(payload);
      await createRefreshToken(validatedUser.id, refreshToken);
      res.json({ accessToken, refreshToken });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).send(error.message);
      } else {
        res.status(500).send('An unknown error occurred');
      }
    }
  }
);

/**
 * Refresh token route to generate new JWT
 */
router.post(
  '/refresh-token',
  async (req: Request, res: Response): Promise<void> => {
  const refreshToken: string | null = passportConfig.getJwtFromHeader(req);

  if (!refreshToken) {
    res.status(401).send('Refresh token not found');
    return;
  }

  try {
    const decoded: TokenPayload = passportConfig.
      verifyRefreshToken(refreshToken) as TokenPayload;

    const existingToken: RefreshToken | null = await 
      findRefreshToken(refreshToken);
    
    if (!existingToken) {
      res.status(403).send('Invalid refresh token');
      return
    }

    const accessToken: string = passportConfig.
      generateAccessToken({ id: decoded.id });

    res.json({ accessToken });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error refreshing token:', error.message);
    } else {
      console.error('Error refreshing token:', error);
    }
    res.status(403).send('Invalid refresh token');
  }
});

/**
 * Logout route to invalidate JWT
 */
router.post(
  '/logout',
  passportConfig.authenticate,
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }
    res.json({ message: 'Logged out' });
  }
);

/**
 * Check user authentication status
 */
router.get(
  '/check-status',
  passportConfig.authenticate,
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res.status(401).send('Unauthorized');
      return;
    }
    res.json({ status: 'Authenticated', user: req.user });
  }
);

export default router;
