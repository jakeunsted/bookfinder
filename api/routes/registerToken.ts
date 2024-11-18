import express from 'express';
import * as passportConfig from '../passport-config.ts';
import { body } from 'express-validator';
import * as service from '../database/services/registerToken.service.ts';

const router = express.Router();

/**
 * @swagger
 * /register-token/validate:
 *   post:
 *     summary: Validate a register token
 *     tags: 
 *       - RegisterToken
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The register token to validate
 *                 example: "your_token_here"
 *     responses:
 *       200:
 *         description: Token validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Whether the token is valid
 *                   example: true
 *       404:
 *         description: Token not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Whether the token is valid
 *                   example: false
 *       500:
 *         description: Internal server error
 */
router.post(
  '/validate',
  body('token')
    .isString()
    .withMessage('Token is required'),
  service.validateRegisterToken
)

/**
 * @swagger
 * /register-token/create:
 *   post:
 *     summary: Create a new register token
 *     tags: 
 *       - RegisterToken
 *     responses:
 *       200:
 *         description: Register token created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: The register token
 *                   example: "your_random_token_here"
 *       500:
 *         description: Internal server error
 */
router.post(
  '/create',
  passportConfig.authenticate,
  service.createRegisterToken
)

export default router;
