const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const passportConfig = require('../passport-config');
const userService = require('../database/services/user.service');

/**
 * Login route to generate JWT
 */
router.post(
  '/login',
  body('username')
    .isString()
    .withMessage('Username is required'),
  body('password')
    .isString()
    .withMessage('Password is required'),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const validatedUser = await userService.verifyPassword(username, password);
      if (!validatedUser) {
        throw new Error('Invalid credentials');
      }
      const payload = { id: validatedUser.id };
      const token = passportConfig.generateToken(payload);
      res.json({ token });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Logout route to invalidate JWT
 */
router.post(
  '/logout',
  passportConfig.authenticate,
  async (req, res) => {
    passportConfig.invalidateToken(req);
    res.json({ message: 'Logged out' });
  }
);

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
  async (req, res) => {
    const { username, password, email, role } = req.body;
  
    try {
      const user = await userService.createUser(username, password, email, role);
      res.json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Get a users role by id
 */
router.get(
  '/role/:id',
  passportConfig.authenticate,
  async (req, res) => {
    const { id } = req.params;
    try {
      const role = await userService.getUserRoleById(id);
      res.json(role);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Get user by id
 */
router.get(
  '/:id',
  passportConfig.authenticate,
  async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Check user authentication status
 */
router.get(
  '/check-status',
  passportConfig.authenticate,
  async (req, res) => {
    res.json({ status: 'Authenticated' });
  }
);

module.exports = router;
