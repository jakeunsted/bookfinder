import express, { Request, Response } from 'express';
import { 
  param, body, validationResult, CustomValidator 
} from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import * as usersBooksService from '../database/services/usersBooks.service.ts';
import * as bookService from '../database/services/book.service.ts';

const router = express.Router();

// Custom date validator
const isValidDate: CustomValidator = (value) => {
  if (!value) return true; // Allow null or undefined
  const date = new Date(value);
  return !isNaN(date.getTime());
};

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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
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

/**
 * update a users book entry
 */
router.patch(
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
    .isString()
    .withMessage('Invalid dateStared'),
  body('dateStarted')
    .optional()
    .custom(isValidDate)
    .withMessage('Invalid dateStarted'),
  body('dateFinished')
    .optional()
    .custom(isValidDate)
    .withMessage('Invalid dateFinished'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(412).json({ errors: errors.array() });
    }
    const { userId, bookId } = req.params;
    const { 
      userRating = null, 
      dateStarted = null, 
      dateFinished = null, 
      userNotes = null 
    } = req.body;
    try {
      // check book exists for user
      const existingUserBook = await usersBooksService.getBookForUser(
        Number(userId),
        Number(bookId),
      )
      if (!existingUserBook) {
        return res.status(404).send('Book does not exist for user')
      }
      const book = await usersBooksService.updateUserBook(
        Number(userId),
        Number(bookId),
        userRating,
        dateStarted,
        dateFinished,
        userNotes
      )
      res.json(book)
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).send(error.message);
      } else {
        return res.status(500).send('An unknown error occurred');
      }
    }
  }
)

export default router;