import { Book } from '../database/models/Book.model.ts';
import { 
  BookRecommendations 
} from '../database/models/BookRecommendations.model.ts';
import { UsersBooks } from '../database/models/UsersBooks.model.ts';
import { RefreshToken } from '../database/models/refreshToken.model.ts';
import { User } from '../database/models//user.model.ts';

// Define Models interface
export interface Models {
  Book: typeof Book;
  BookRecommendations: typeof BookRecommendations;
  UsersBooks: typeof UsersBooks;
  RefreshToken: typeof RefreshToken;
  User: typeof User;
}