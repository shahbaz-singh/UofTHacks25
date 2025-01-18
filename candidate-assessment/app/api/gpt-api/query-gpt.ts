import axios from 'axios';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Replace with your OpenAI API key

// Define the prompt and other options
export async function QueryGPT(prompt: string) {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-3.5-turbo', // or 'gpt-3.5-turbo'
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500, // Adjust based on your needs
        temperature: 0.7, // Controls creativity (higher is more creative)
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return content;

  } catch (error) {
    console.error('Error communicating with OpenAI API');
  }
};

