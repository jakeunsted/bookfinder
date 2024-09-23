import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import * as ai from '../modules/ai/index.ts';
import * as booksModule from '../modules/books/index.ts';
// import { addBookRecord } from '../database/services/book.service';

const router = express.Router();

/**
 * GET route to find related books for given ISBN
 */
router.get(
  '/related-books',
  passportConfig.authenticate,
  query('isbn')
    .isISBN()
    .withMessage('ISBN is required'),
  async (req: Request, res: Response) => {
    const { isbn } = req.query as { isbn: string };

    /** 
     * Get ID from JWT
     */
    // const userId = req.user.id;

    try {
      const response = await ai.findRelatedBooks(isbn);
      if (!response) {
        return res.status(404).send('No related books found');
      }

      const relatedBooks = await Promise.allSettled(
        Array.isArray(response) ? response.map(async (relatedIsbn: string) => {
          try {
            return await booksModule.getBookByISBN(relatedIsbn);
          } catch (error) {
            console.error(
              `Failed to fetch book with ISBN ${relatedIsbn}:`, error
            );
            return null;
          }
        })
        : []
      );
      
      // Filter out any null values (failed requests)
      const books = relatedBooks
        .filter(result => 
          result.status === 'fulfilled' && result.value !== null)
        .map(result => (
          result as 
            // eslint-disable-next-line max-len
            PromiseFulfilledResult<Awaited<ReturnType<typeof booksModule.getBookByISBN>>>
        ).value);

      // const book = await addBookRecord(isbn, response, tags = [], userId);
      // await addBookRecommendations(book.id, books, userId);
      res.json({ books });
    } catch (error) {
      res.status(500).send(
        'Error with related books: ' + (error as Error).message
      );
    }
  }
);

export default router;