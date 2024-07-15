const express = require('express');
const { query } = require('express-validator');
const router = express.Router();
const passportConfig = require('../passport-config');

const { findRelatedBooks } = require('../modules/ai');
const { getBookByISBN } = require('../modules/books');

/**
 * GET route to find related books for given ISBN
 */
router.get(
  '/related-books',
  passportConfig.authenticate,
  query('isbn')
    .isISBN()
    .withMessage('ISBN is required'),
  async (req, res) => {
    const { isbn } = req.query;

    try {
      const response = await findRelatedBooks(isbn);
      const relatedBooks = await Promise.all(
        response.map(async (relatedIsbn) => {
          return await getBookByISBN(relatedIsbn);
        })
      );
      res.json({ relatedBooks });
    } catch (error) {
      res.status(500).send('Error with related books: ' + error.message);
    }
  }
);

module.exports = router;