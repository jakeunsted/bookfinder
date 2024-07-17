require('dotenv').config()
const express = require('express');
const passportConfig = require('./passport-config');
const app = express();

app.use(passportConfig.initialize());

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const aiRouter = require('./routes/ai');
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/ai', aiRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});;

/**
 * Connect to the database
 */
const { connectToDatabase } = require('./database/db')
connectToDatabase();
