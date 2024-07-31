require('dotenv').config()
const express = require('express');
const passportConfig = require('./passport-config');
const cors = require('cors');
const app = express();

app.use(passportConfig.initialize());

app.use(express.json());

app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: ['GET', 'POST'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const aiRouter = require('./routes/ai');
const authRouter = require('./routes/auth');
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/ai', aiRouter);
app.use('/auth', authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});;

/**
 * Cron Tasks
 */
const scheduleTokenDeletion = require('./tasks/removeTokens');
scheduleTokenDeletion();

/**
 * Connect to the database
 */
const { connectToDatabase } = require('./database/db')
connectToDatabase();
