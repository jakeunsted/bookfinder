import express, { Request, Response } from 'express';
import { param, query, validationResult } from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import * as books from '../modules/books/index.ts';
import { addBookRecord } from '../database/services/book.service.ts';

const router = express.Router();

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

router.get(
  '/',
  passportConfig.authenticate,
  query('title')
    .isString()
    .withMessage('Name query parameter is required'),
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
      res.status(500).send('Error searching books by name');
    }
  }
);

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

export default router;