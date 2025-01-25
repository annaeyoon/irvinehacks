// Import the necessary packages
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Create a new instance of the Groq class
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Define an async function to get chat completion
export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  console.log(chatCompletion.choices[0]?.message?.content || '');
}

// Function to get chat completion
export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: 'HI',
      },
    ],
    model: 'llama-3.3-70b-versatile',
  });
}

// Run the main function
main().catch(console.error);
