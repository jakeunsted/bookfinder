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
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The access token for the user
 *                 refreshToken:
 *                   type: string
 *                   description: The refresh token for the user
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       description: The user ID
 *                     username:
 *                       type: string
 *                       description: The username of the user
 *                     email:
 *                       type: string
 *                       description: The email of the user
 *                     role:
 *                       type: string
 *                       description: The role of the user
 *       500:
 *         description: Internal server error
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
      res.json({ accessToken, refreshToken, user: validatedUser });
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
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: New access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The new access token
 *                   example: "your_new_access_token_here"
 *       401:
 *         description: Refresh token not found
 *       403:
 *         description: Invalid refresh token
 *       500:
 *         description: Internal server error
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
    const decoded = 
      passportConfig.verifyRefreshToken(refreshToken) as { id: number };

    const existingToken: RefreshToken | null = await 
      findRefreshToken(refreshToken);
    
    if (!existingToken) {
      res.status(403).send('Invalid refresh token');
      return;
    }

    const accessToken: string = 
      passportConfig.generateAccessToken({ id: decoded.id });

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
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to invalidate
 *                 example: "your_refresh_token_here"
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Logged out"
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /auth/check-status:
 *   get:
 *     summary: Check user authentication status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: The status of the user
 *                   example: "Authenticated"
 *                 user:
 *                   type: object
 *                   description: The user object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
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
