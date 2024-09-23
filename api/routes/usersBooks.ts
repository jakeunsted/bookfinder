import express, { Request, Response } from 'express';
import { param, body } from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import * as usersBooksService from '../database/services/usersBooks.service.ts';
import * as bookService from '../database/services/book.service.ts';

const router = express.Router();

/**
 * Get all books for a user
 */
router.get(
  '/:userId',
  passportConfig.authenticate,
  param('userId')
    .isInt()
    .withMessage('User ID is required'),
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      const books = await usersBooksService.getBooksForUser(Number(userId));
      res.json(books);
    } catch (error) {
      res.status(500).send((error as Error).message);
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
  async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;
    try {
      const book = await usersBooksService.getBookForUser(
        Number(userId),
        Number(bookId)
      );
      res.json(book);
    } catch (error) {
      res.status(500).send((error as Error).message);
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
  async (req: Request, res: Response) => {
    const { userId, bookId } = req.params;
    const { 
      userRating = null, 
      dateStarted = null, 
      dateFinished = null, 
      userNotes = null 
    } = req.body;
    try {
      // check if the book exists
      const existingBook = await bookService.getBookById(Number(bookId));
      if (!existingBook) {
        return res.status(404).send('Book does not exist');
      }

      const book = await usersBooksService.addBookToUser(
        Number(userId),
        Number(bookId),
        userRating,
        dateStarted,
        dateFinished,
        userNotes
      );
      res.json(book);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
);

export default router;