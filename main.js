import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import prompts from 'prompts';

// Load environment variables from the .env file
dotenv.config();

// Create a new instance of the Groq class
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

  
// Function to get chat completion
async function chat() {
  let conversationContext = {
    "messages": [
      {
      "role": "system",
      "content": "You are acting as a travel itinerary planner. The user will prompt you with a location, a time frame, " +
                "and a budget for just activities(housing and flights are already bought). Give them multiple activities that they can do and let them finalize which 3 they want. " + 
                "Once they have finalized the three, summarize the three and give a total cost that should be close to the budget provided, and then " +
                "just provide the three activites in a json object called 'vacation' with the 'destination' and then an 'itinerary' json object 'activity', 'location', 'price' and 'description' " +
                "in JSON format with the label 'JSON ITINERARY' in front, do not tell them you are giving it to them in JSON format.",
      },
      {
      "role": "assistant",
      "content": "Hello! I am your virtual travel assistant. Let me know where you're traveling next, the time frame, " +
                "what you're interested in and your budget! I can provide you a few options that you can narrow down to " + 
                "put in your scrapbook!",
      },
    ],
  };
  let response = await prompts({
    type: 'text',
    name: 'input',
    message: "Hello! I am your virtual travel assistant. Let me know where you\'re traveling next, the time frame, " +
    "what you\'re interested in and your budget for activities! I can provide you a few options that you can " + 
    "narrow down to put in your scrapbook!",
  });

  while (true) {
    if (response.input.toLowerCase() === "exit") {
      console.log('Goodbye!');
      return conversationContext.messages; // Exit the function
    }
    conversationContext.messages.push({
      "role": "user",
      "content": response.input,
    });
    try {
      const chatCompletion = await groq.chat.completions.create({
      // Define the request parameter
      "messages": conversationContext.messages,
      "model": 'llama-3.3-70b-versatile',
      "temperature": 1,
      "max_completion_tokens": 1024,
      });
      const assistantMessage = chatCompletion.choices[0]?.message.content || 'No response from assistant.';
      console.log(`Assistant: ${assistantMessage}`);
      conversationContext.messages.push({
        "role": "assistant",
        "content": assistantMessage,
      });

      // Prompt the user for the next input
      response = await prompts({
        type: 'text',
        name: 'input',
        message: '(type exit to leave): '
      });
    } catch (error) {
      console.error("Error fetching: ", error);
    }
  }
}

async function main() {
  console.log("Starting chat...");
  const chat_history = await chat();
  console.log("Chat finished...");

  for (const message of chat_history) {
    if (message.role === "assistant") {
      if (message.content.includes("JSON ITINERARY")) {
        const jsonString = message.content.split("JSON ITINERARY")[1].trim();

        try {
          // Parse the extracted JSON
          const itinerary = JSON.parse(jsonString);
          console.log("Extracted Itinerary:", itinerary);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      }
    }
  }
}

main();