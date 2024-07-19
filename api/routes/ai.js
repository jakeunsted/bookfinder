const express = require('express');
const { query } = require('express-validator');
const router = express.Router();
const passportConfig = require('../passport-config');

const { findRelatedBooks } = require('../modules/ai');
const { getBookByISBN } = require('../modules/books');
const { addBookRecord } = require('../database/services/books.service');

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

    /** 
     * Get ID from JWT
     */
    const userId = req.user.id;

    try {
      const response = await findRelatedBooks(isbn);
      const relatedBooks = await Promise.allSettled(
        response.map(async (relatedIsbn) => {
          try {
            return await getBookByISBN(relatedIsbn);
          } catch (error) {
            console.error(`Failed to fetch book with ISBN ${relatedIsbn}:`, error);
            return null;
          }
        })
      );
      
      // Filter out any null values (failed requests)
      const books = relatedBooks
        .filter(result => result.status === 'fulfilled' && result.value !== null)
        .map(result => result.value);

      await addBookRecord(isbn, response, userId);
      res.json({ books });
    } catch (error) {
      res.status(500).send('Error with related books: ' + error.message);
    }
  }
);

module.exports = router;