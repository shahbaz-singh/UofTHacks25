

// export async function evaluateSolution(userAnswer: string, expectedAnswer: string): Promise<string> {
//     // Initialize OpenAI API
//     const configuration = new Configuration({
//       apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
//     });
//     const openai = new OpenAIApi(configuration);

import axios from "axios";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY; // Replace with your OpenAI API key
  
//     // Define the prompt for OpenAI
//     const prompt = `
//   You are an expert code reviewer and grader. 
//   Evaluate the following user's code submission based on the provided description of required changes. 
//   Assign a score out of 500 following these guidelines:
  
//   - **500**: Perfect solution. No issues.
//   - **400-499**: Minor syntactical or stylistic issues.
//   - **200-399**: Correct approach but with significant issues.
//   - **0-199**: Incorrect solution with little to no alignment with expected changes.
  
//   Provide the score in the format \`[Score] - Explanation\`.
  
//   **User's Code Submission:**
//   \`\`\`javascript
//   ${userAnswer}
//   \`\`\`
  
//   **Description of Required Changes:**
//   \`\`\`
//   ${expectedAnswer}
//   \`\`\`
  
//   **Evaluation:**
//   `;
  
//     try {
//       // Make a request to OpenAI's GPT-4 model
//       const response = await openai.createChatCompletion({
//         model: 'gpt-4',
//         messages: [
//           { role: 'system', content: 'You are a helpful assistant that evaluates code submissions based on given criteria.' },
//           { role: 'user', content: prompt },
//         ],
//         max_tokens: 500,
//         temperature: 0, // Ensures deterministic output
//       });
  
//       // Extract the assistant's reply
//       const evaluation = response.data.choices[0].message?.content.trim();
  
//       // Validate the response format
//       const scorePattern = /^\[(\d{1,3})\]\s*-\s*(.*)$/;
//       const match = evaluation?.match(scorePattern);
  
//       if (match) {
//         let score = parseInt(match[1], 10);
//         const explanation = match[2];
  
//         // Ensure score is within 0-500
//         score = Math.max(0, Math.min(score, 500));
  
//         return `[${score}] - ${explanation}`;
//       } else {
//         // Handle unexpected response format
//         console.warn('Unexpected evaluation format:', evaluation);
//         return `[0] - Unable to evaluate the submission. Please try again.`;
//       }
  
//     } catch (error: any) {
//       console.error('Error evaluating solution:', error.response?.data || error.message);
//       return `[0] - An error occurred while evaluating the submission. Please try again later.`;
//     }
//   }

export async function SolutionQueryGPT(files: { [key: string]: string }, expectedFunctionality: string) {
    console.log(`user modified files: ${JSON.stringify(files)}`);
    const prompt: string = `
    You are a senior engineer who is experienced at building correct and well-formatted programs. 
    The files below initially had a bug in them that prevented the expected functionality from being fulfilled. 
    I am providing you with the files after the user modified them in an attempt to fix the bug. I want you 
    to analyze the files and mark the solution based on how well the user was able to fix the bug to provide 
    the expected functionality. In particular, I want you to grade based on the criteria below: 
    - do the files below provide the expected functionality? does the code cover all edge cases?
    - is the code well formatted according to professional software development practices? (i.e. line length not too long, indenting when necessary, etc.)
    - are there adequate comments (comments are anywhere where two forward slashes are found next to each other with no space between them). if there are comments that cover the core
      parts of the code (i.e. the parts that perform the main logic of the function) then don't deduct marks for not including comments.
    -  are there docstrings for complex functions/classes? if the function is not complex, don't deduct marks for not including docstrings. 
    Your output should be a string and include the following, and NOTHING MORE AND NOTHING LESS:
    - a score from 1-10 based on how well the user fulfilled the success criteria defined above.
    - feedback on how the user could have improved their solution IF they did not score a 10.
    DO NOT JUDGE THE SOLUTION BASED ON ANY OTHER CRITERIA.
    RESPONSE FORMAT: <score>. <feedback>. 

    files: 
    ${Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('\n')} 
    
    expected functionality: 
    ${expectedFunctionality}`

//     const prompt: string = `
//     detect if there is a comment in the code block below:

//     // this function calculates the sum of 2 numbers and returns it
// function calculateSum(a, b) { 
//   // compute the sum of the two numbers and return it.
//   return a + b; 
// }
//     `

    console.log(`the prompt is ${prompt}`);

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
        return content as string;
    
      } catch (error) {
        console.error('Error communicating with OpenAI API');
        return "";
      }
}