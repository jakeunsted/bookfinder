import express, { Request, Response } from 'express';
import { body, param } from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import {
  createUser,
  getUserRoleById,
  getUserById 
} from '../database/services/user.service.ts';

const router = express.Router();

/**
 * Create a new user
 */
router.post(
  '/signup',
  body('username')
    .isString()
    .withMessage('Username is required'),
  body('password')
    .isString()
    .withMessage('Password is required'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email is required'),
  body('role')
    .isString()
    .withMessage('Role is required'),
  async (req: Request, res: Response) => {
    const { username, password, email, role } = req.body;
  
    try {
      const user = await createUser(username, password, email, role);
      res.json(user);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
);

/**
 * Get a user's role by id
 */
router.get(
  '/role/:id',
  passportConfig.authenticate,
  param('id')
    .isInt()
    .withMessage('ID must be an integer'),
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const role = await getUserRoleById(Number(id));
      res.json(role);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
);

/**
 * Get user by id
 */
router.get(
  '/:id',
  param('id')
    .isInt()
    .withMessage('ID must be an integer'),
  passportConfig.authenticate,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const user = await getUserById(Number(id));
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user.dataValues);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
);

export default router;