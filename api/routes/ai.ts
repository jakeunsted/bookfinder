import express, { Request, Response } from 'express';
import { query } from 'express-validator';
import * as passportConfig from '../passport-config.ts';
import * as ai from '../modules/ai/index.ts';
import * as booksModule from '../modules/books/index.ts';
import { addBookRecord } from '../database/services/book.service.ts';
import { 
  addBookRecommendations 
} from '../database/services/bookRecommendations.service.ts'

/**
 * Types
 */
import { Book } from '../database/models/Book.model.ts'
import { User } from '../database/models/user.model.ts'

const router = express.Router();

/**
 * GET route to find related books for given ISBN
 */
router.post(
  '/related-books',
  passportConfig.authenticate,
  query('isbn')
    .isISBN()
    .withMessage('ISBN is required'),
  async (req: Request, res: Response) => {
    const { isbn, title, author } = req.query as { 
      isbn: string, title: string, author: string 
    };

    try {
      const response = await ai.findRelatedBooks(isbn, title, author);
      if (!response) {
        return res.status(404).send('No related books found');
      }
      
      const relatedBooks = await Promise.allSettled(
        Array.isArray(response) ? response.map(async (relatedIsbn: string) => {
          try {
            const book = await booksModule.getBookByISBN(relatedIsbn);
            if (!book) {
              return null;
            }
          } catch (error) {
            console.error(
              `Failed to fetch book with ISBN ${relatedIsbn}:`, error
            );
            return null;
          }
        })
        : []
      );

      // needs to do it if it doesn't exist
      // const userId: number = (req.user as User).id; 
      // let saveBook: Book | null = null;
      // if (req?.body?.book) {
      //   const { 
      //     title, isbn, tags = [], createdById, quickLink 
      //   } = req.body.book;
      //   saveBook = await addBookRecord(
      //     title,
      //     isbn,
      //     tags,
      //     createdById,
      //     quickLink
      //   )
      // }
      // if (saveBook && userId) {
      //   addBookRecommendations(
      //     saveBook.id,
      //     relatedBooks,
      //     userId,
      //   )
      // }
      
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