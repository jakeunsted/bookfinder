/**
 * Use Open AI API to make a request to the GPT-3.5-turbo-0125 model
 */
import dotenv from 'dotenv';
dotenv.config();
import { OpenAI } from 'openai';

interface OpenAIResponse {
  choices: {
    message: {
      content: string | null;
    };
  }[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // engine
});

/**
 * Use the OpenAI API to find related books from 
 * a given ISBN number. It should return a list of ISBN 
 * numbers of similar books.
 */
export const findRelatedBooks = async (
  isbn: string, title: string, author: string
): Promise<string[]> => {
  if (!isbn) {
    throw new Error('ISBN is required');
  }

  const response: OpenAIResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{
      role: 'user',
      content: `
        You are a chatbot designed to recommend books similar 
        to the one provided.
        I will give you an ISBN number, book title and author, 
        you will give me a 
        maximum of 10 recommended book ISBNs.
        Only return the valid ISBN numbers of the books. 
        Do not say any other words.
        Return in a JSON format, like 
        {"one": "1", "two": "2", 
        ... }.
        The ISBN is ${isbn}, the book is named ${title} by ${author}
      `,
    }],
  });

  // Extract the content from the response
  const jsonResponse = response.choices[0].message.content;

  let parsedResponse: Record<string, string>;
  try {
    if (!jsonResponse) {
      throw new Error('Received null or empty response from API');
    }
    parsedResponse = JSON.parse(jsonResponse);
  } catch (error) {
    throw new Error('Failed to parse JSON response from API: ' + 
      (error as Error).message);
  }

  // Extract values from the parsedResponse object to get an array of ISBNs
  const isbnArray: string[] = Object.values(parsedResponse);

  return isbnArray;
}
