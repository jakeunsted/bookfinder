const express = require('express');
const { param, body } = require('express-validator');
const router = express.Router();
const passportConfig = require('../passport-config');
const usersBooksService = require('../database/services/usersBooks.service');
const bookService = require('../database/services/book.service');

/**
 * Get all books for a user
 */
router.get(
  '/:userId',
  passportConfig.authenticate,
  param('userId')
    .isInt()
    .withMessage('User ID is required'),
  async (req, res) => {
    const { userId } = req.params;
    try {
      const books = await usersBooksService.getBooksForUser(userId);
      res.json(books);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Get single book for a user.
 * User to get the users data of the book.
 */
router.get(
  '/:userId/:bookId',
  passportConfig.authenticate,
  param('userId')
    .isInt()
    .withMessage('User ID is required'),
  param('bookId')
    .isInt()
    .withMessage('Book ID is required'),
  async (req, res) => {
    const { userId, bookId } = req.params;
    try {
      const book = await usersBooksService.getBookForUser(userId, bookId);
      res.json(book);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

/**
 * Save a book to a user
 * userId and bookId required in params
 */
router.post(
  '/:userId/:bookId',
  passportConfig.authenticate,
  param('userId')
    .isInt()
    .withMessage('User ID is required'),
  param('bookId')
    .isInt()
    .withMessage('Book ID is required'),
  body('userRating')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('User rating must be between 1 and 10'),
  body('dateStarted')
    .optional()
    .isDate(),
  body('dateFinished')
    .optional()
    .isDate(),
  body('userNotes')
    .optional()
    .isString(),
  async (req, res) => {
    const { userId, bookId } = req.params;
    const { 
      userRating = null, 
      dateStarted = null, 
      dateFinished = null, 
      userNotes = null 
    } = req.body;
    try {
      // check if the book exists
      const existingBook = await bookService.getBookById(bookId);
      if (!existingBook) {
        return res.status(404).send('Book does not exist');
      }

      const book = await usersBooksService.addBookToUser(
        userId, bookId, userRating, dateStarted, dateFinished, userNotes
      );
      res.json(book);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
