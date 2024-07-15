const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const passportConfig = require('../passport-config');

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
  
    // Validate the user credentials (this is just a demonstration, replace with your actual user validation)
    if (username === 'jake' && password === 'test') {
      const payload = { username };
      const token = passportConfig.generateToken(payload);
      res.json({ token });
    } else {
      res.status(401).send('Invalid credentials');
    }
  }
);

module.exports = router;
