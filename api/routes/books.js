const express = require('express');
const { param, query, validationResult } = require('express-validator'); // Add this line
const router = express.Router();
const passportConfig = require('../passport-config');
const books = require('../modules/books');

router.get(
  '/:isbn',
  passportConfig.authenticate,
  param('isbn')
    .isISBN()
    .withMessage('Invalid ISBN'),
  async (req, res) => {
    const result = await books.getBookByISBN(req.params.isbn);
    console.log('express result', result);
    res.send(result);
  }
);

router.get(
  '/',
  passportConfig.authenticate,
  query('title')
    .isString()
    .withMessage('Name query parameter is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await books.searchBooksByTitle(req.query.title);
      console.log('express result', result);
      res.send(result);
    } catch (error) {
      console.log('error', error);
      res.status(500).send('Error searching books by name');
    }
  }
);

module.exports = router;
