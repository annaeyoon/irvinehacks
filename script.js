import Groq from 'groq-sdk';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  console.log(chatCompletion.choices[0]?.message?.content || '');
}

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

main().catch(console.error);
