import express, { Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import * as books from '../modules/books/index.ts';
import { 
  addBookRecord, 
  storygraphImport 
} from '../database/services/book.service.ts';
import multer from 'multer';

const storage = multer.memoryStorage();
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

const router = express.Router();

/**
 * @swagger
 * /books/{isbn}:
 *   get:
 *     summary: Get book by ISBN
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         schema:
 *           type: string
 *         required: true
 *         description: The ISBN of the book
 *     responses:
 *       200:
 *         description: The book data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Internal server error
 */
router.get(
  '/:isbn',
  passportConfig.authenticate,
  param('isbn')
    .isISBN()
    .withMessage('Invalid ISBN'),
  async (req: Request, res: Response) => {
    const result = await books.getBookByISBN(req.params.isbn);
    res.send(result);
  }
);

/**
 * @swagger
 * /books/:
 *   get:
 *     summary: Search books by title
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The title of the book
 *     responses:
 *       200:
 *         description: List of books matching the title
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Validation errors
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  passportConfig.authenticate,
  query('title')
    .isString()
    .withMessage('Title query parameter is required'),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await books.searchBooksByTitle(req.query.title as string);
      res.send(result);
    } catch (error) {
      console.log('error', error);
      res.status(500).send('Error searching books by title');
    }
  }
);

/**
 * @swagger
 * /books/:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book
 *                 example: "The Great Gatsby"
 *               isbn:
 *                 type: string
 *                 description: The ISBN of the book
 *                 example: "978-0743273565"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the book
 *                 example: ["classic", "novel"]
 *               createdById:
 *                 type: integer
 *                 description: The ID of the user who created the book record
 *                 example: 1
 *               quickLink:
 *                 type: string
 *                 description: A quick link to the book
 *                 example: "https://example.com/book"
 *     responses:
 *       200:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the added book
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the book
 *                   example: "The Great Gatsby"
 *                 isbn:
 *                   type: string
 *                   description: The ISBN of the book
 *                   example: "978-0743273565"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Tags associated with the book
 *                   example: ["classic", "novel"]
 *                 createdById:
 *                   type: integer
 *                   description: The ID of the user who created the book record
 *                   example: 1
 *                 quickLink:
 *                   type: string
 *                   description: A quick link to the book
 *                   example: "https://example.com/book"
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  passportConfig.authenticate,
  async (req: Request, res: Response) => {
    const { title, isbn, tags = [], createdById, quickLink } = req.body;
    try {
      const book = await addBookRecord(
        title,
        isbn,
        tags,
        createdById,
        quickLink
      );
      res.json(book);
    } catch (error) {
      console.error('error', error);
      res.status(500).send('Error adding book');
    }
  }
);

router.post(
  '/storygraph/import',
  passportConfig.authenticate,
  upload.single('file'),
  storygraphImport
)

export default router;