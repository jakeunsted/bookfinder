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
 * @swagger
 * /users-books/{userId}:
 *   get:
 *     summary: Get books for a user
 *     tags: [UsersBooks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A list of books for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /users-books/{userId}/{bookId}:
 *   get:
 *     summary: Get a book for a user
 *     tags: [UsersBooks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Internal server error
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
 * @swagger
 * /users-books/{userId}/{bookId}:
 *   post:
 *     summary: Add a book to a user
 *     tags: [UsersBooks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userRating:
 *                 type: integer
 *                 description: The user's rating of the book
 *                 example: 8
 *               dateStarted:
 *                 type: string
 *                 description: The date the user started reading the book
 *                 example: "2022-01-01"
 *               dateFinished:
 *                 type: string
 *                 description: The date the user finished reading the book
 *                 example: "2022-02-01"
 *               userNotes:
 *                 type: string
 *                 description: The user's notes about the book
 *                 example: "A great read!"
 *     responses:
 *       200:
 *         description: The book added to the user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation errors
 *       404:
 *         description: Book does not exist
 *       500:
 *         description: Internal server error
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
    .optional({ nullable: true })
    .isInt({ min: 1, max: 10 })
    .withMessage('User rating must be between 1 and 10'),
  body('dateStarted')
    .optional({ nullable: true })
    .isString(),
  body('dateFinished')
    .optional({ nullable: true })
    .isString(),
  body('userNotes')
    .optional({ nullable: true })
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

      console.log('adding book to user', userId, bookId)

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
      console.error('error', error);
      res.status(500).send((error as Error).message);
    }
  }
);
/**
 * @swagger 
 * /users-books/{userId}/{bookId}:
 *   patch:
 *     summary: Update a users book entry
 *     tags: [UsersBooks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userRating:
 *                 type: integer
 *                 description: The user's rating of the book
 *                 example: 8
 *               dateStarted:
 *                 type: string
 *                 description: The date the user started reading the book
 *                 example: "2022-01-01"
 *               dateFinished:
 *                 type: string
 *                 description: The date the user finished reading the book
 *                 example: "2022-02-01"
 *               userNotes:
 *                 type: string
 *                 description: The user's notes about the book
 *                 example: "A great read!"
 *     responses:
 *       200:
 *         description: The book updated for the user successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Book does not exist for user
 *       500:
 *         description: Internal server error
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
    .optional({ nullable: true })
    .isInt({ min: 1, max: 10 })
    .withMessage('User rating must be between 1 and 10'),
  body('dateStarted')
    .optional({ nullable: true })
    .isString()
    .withMessage('Invalid dateStared'),
  body('dateStarted')
    .optional({ nullable: true })
    .custom(isValidDate)
    .withMessage('Invalid dateStarted'),
  body('dateFinished')
    .optional({ nullable: true })
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

/**
 * @swagger
 * /users-books/{userId}/{bookId}:
 *   delete:
 *     summary: Delete a book from a user
 *     tags: [UsersBooks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user ID
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book was successfully removed from the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Book deleted"
 *       500:
 *         description: Internal server error
 */
router.delete(
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
      await usersBooksService.deleteBookFromUser(
        Number(userId),
        Number(bookId)
      );
      console.log('deleted book, bookId', bookId);
      res.status(200).send({ message: 'Book deleted' });
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  }
)

export default router;