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
  body('username').isString().withMessage('Username is required'),
  body('password').isString().withMessage('Password is required'),
  async (req, res) => {
    const { username, password } = req.body;

    try {
      const validatedUser = await userService.verifyPassword(username, password);
      if (!validatedUser) {
        throw new Error('Invalid credentials');
      }
      const payload = { id: validatedUser.id };
      const accessToken = passportConfig.generateAccessToken(payload);
      const refreshToken = passportConfig.generateRefreshToken(payload);
      await userService.createRefreshToken(validatedUser.id, refreshToken);
      res.json({ accessToken, refreshToken });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Refresh token route to generate new JWT
 */
router.post('/refresh-token', async (req, res) => {
  const refreshToken = passportConfig.getJwtFromHeader(req);

  if (!refreshToken) {
    return res.status(401).send('Refresh token not found');
  }

  try {
    const decoded = passportConfig.verifyRefreshToken(refreshToken);

    const existingToken = await userService.findRefreshToken(refreshToken);
    
    if (!existingToken) {
      return res.status(403).send('Invalid refresh token');
    }

    const accessToken = passportConfig.generateAccessToken({ id: decoded.id });

    res.json({ accessToken });
  } catch (error) {
    console.error('Error refreshing token:', error.message);
    res.status(403).send('Invalid refresh token');
  }
});

/**
 * Logout route to invalidate JWT
 */
router.post(
  '/logout',
  passportConfig.authenticate,
  async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await userService.deleteRefreshToken(refreshToken);
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
  async (req, res) => {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }
    res.json({ status: 'Authenticated', user: req.user });
  }
);

module.exports = router;
