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
 * @swagger
 * user/signup:
 *   post:
 *     summary: Create a new user
 *     tags: 
 *       - User
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
 *               email:
 *                 type: string
 *                 description: The email of the user
 *                 example: johndoe@example.com
 *               role:
 *                 type: string
 *                 description: The role of the user
 *                 example: admin
 *     responses:
 *       200:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The user ID
 *                   example: 1
 *                 username:
 *                   type: string
 *                   description: The username of the user
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   description: The email of the user
 *                   example: johndoe@example.com
 *                 role:
 *                   type: string
 *                   description: The role of the user
 *                   example: admin
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /user/role/{id}:
 *   get:
 *     summary: Get user role by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user role
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: admin
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
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