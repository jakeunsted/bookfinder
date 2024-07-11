const express = require('express');
const { param, query, validationResult } = require('express-validator');
const app = express();

const { getBookByISBN, searchBooksByTitle } = require('./modules/books');

app.get('/health', (req, res) => {
  res.send('Alive');
});

/**
 * Get single book by isbn
 */
app.get(
  '/book/:isbn',
  param('isbn')
    .isISBN()
    .withMessage('Invalid ISBN'),
  async (req, res) => {
    const result = await getBookByISBN(req.params.isbn)
    console.log('express result', result);
    res.send(result);
  }
);

/**
 * Get books by title or partial title
 */
app.get(
  '/books',
  query('title')
    .isString()
    .withMessage('Name query parameter is required'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const result = await searchBooksByTitle(req.query.title);
      console.log('express result', result);
      res.send(result);
    } catch (error) {
      console.log('error', error);
      res.status(500).send('Error searching books by name');
    }
  }
);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
