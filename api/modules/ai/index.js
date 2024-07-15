/**
 * Use Open AI API to make a request to the GPT-3.5-turbo-0125 model
 */
const { OpenAI} = require('openai');
require('dotenv').config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  engine: 'gpt-3.5-turbo-0125',
})

/**
 * Use the OpenAI API to find related books from a given ISBN number. It should return a list of ISBN numbers of similar books.
 */
const findRelatedBooks = async (isbn) => {
  if (!isbn) {
    throw new Error('ISBN is required');
  }

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'user', content: `
      You are a chatbot designed to recommend books similar to the one provided.
      I will give you an ISBN number, you will give me 5 recommended book ISBNs.
      Only return the ISBN numbers of the books. Do not say any other words.
      Return in a JSON format, like {"one": "1234567890", "two": "1234567890" ... }.
      `,
    }],
  })

  console.log('response', response.choices[0].message.content);

  // Extract the content from the response
  const jsonResponse = response.choices[0].message.content;

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(jsonResponse);
  } catch (error) {
    throw new Error('Failed to parse JSON response from API: ' + error.message);
  }

  // Extract values from the parsedResponse object to get an array of ISBNs
  const isbnArray = Object.values(parsedResponse);

  return isbnArray;
}

module.exports = {
  findRelatedBooks
};