const express = require('express');
const passportConfig = require('./passport-config');
const app = express();

app.use(passportConfig.initialize());

app.use(express.json());

app.get('/health', (req, res) => {
  res.send('Alive');
});

const booksRouter = require('./routes/books');
const userRouter = require('./routes/user');
const aiRouter = require('./routes/ai');
app.use('/books', booksRouter);
app.use('/user', userRouter);
app.use('/ai', aiRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
