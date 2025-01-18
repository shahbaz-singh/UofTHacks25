

export async function evaluateSolution(userAnswer: string, expectedAnswer: string): Promise<string> {
    // Initialize OpenAI API
    const configuration = new Configuration({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
  
    // Define the prompt for OpenAI
    const prompt = `
  You are an expert code reviewer and grader. 
  Evaluate the following user's code submission based on the provided description of required changes. 
  Assign a score out of 500 following these guidelines:
  
  - **500**: Perfect solution. No issues.
  - **400-499**: Minor syntactical or stylistic issues.
  - **200-399**: Correct approach but with significant issues.
  - **0-199**: Incorrect solution with little to no alignment with expected changes.
  
  Provide the score in the format \`[Score] - Explanation\`.
  
  **User's Code Submission:**
  \`\`\`javascript
  ${userAnswer}
  \`\`\`
  
  **Description of Required Changes:**
  \`\`\`
  ${expectedAnswer}
  \`\`\`
  
  **Evaluation:**
  `;
  
    try {
      // Make a request to OpenAI's GPT-4 model
      const response = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that evaluates code submissions based on given criteria.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 500,
        temperature: 0, // Ensures deterministic output
      });
  
      // Extract the assistant's reply
      const evaluation = response.data.choices[0].message?.content.trim();
  
      // Validate the response format
      const scorePattern = /^\[(\d{1,3})\]\s*-\s*(.*)$/;
      const match = evaluation?.match(scorePattern);
  
      if (match) {
        let score = parseInt(match[1], 10);
        const explanation = match[2];
  
        // Ensure score is within 0-500
        score = Math.max(0, Math.min(score, 500));
  
        return `[${score}] - ${explanation}`;
      } else {
        // Handle unexpected response format
        console.warn('Unexpected evaluation format:', evaluation);
        return `[0] - Unable to evaluate the submission. Please try again.`;
      }
  
    } catch (error: any) {
      console.error('Error evaluating solution:', error.response?.data || error.message);
      return `[0] - An error occurred while evaluating the submission. Please try again later.`;
    }
  }