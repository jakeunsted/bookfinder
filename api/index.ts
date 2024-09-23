import dotenv from 'dotenv'; 
dotenv.config();
import express, { Request, Response } from 'express';
import * as passportConfig from './passport-config.ts';
import cors from 'cors';
import booksRouter from './routes/books.ts';
import userRouter from './routes/user.ts';
import aiRouter from './routes/ai.ts';
import authRouter from './routes/auth.ts';
import usersBooksRouter from './routes/usersBooks.ts';
import scheduleTokenDeletion from './tasks/removeTokens.ts';
import { connectToDatabase } from './database/db.ts';

const app = express();

app.use(passportConfig.initialize());

app.use(express.json());

app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('OK');
});

app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/ai', aiRouter);
app.use('/auth', authRouter);
app.use('/users-books', usersBooksRouter);

app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/**
 * Cron Tasks
 */
scheduleTokenDeletion();
console.log('scheduled token deletion');
/**
 * Connect to the database
 */
connectToDatabase();