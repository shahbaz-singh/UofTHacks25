import axios from "axios";

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;


export async function UMLQueryGPT(files: { [key: string]: string }, diagram: string) {
    console.log(`user modified files: ${JSON.stringify(files)}`);
    
    let prompt: string;
    
    if (diagram === "/1.jpg") {
        prompt = `you are a senior engineer who is experienced in system design. you are given a set of java files that 
        implement some sort of system. I want you to provide a score from 1-100 for each of the 3 categories:
        - Class Representations: score 100 if there is a Client, Account, CheckingsAccount and SavingsAccount class.
        - Relationships: score 100 if the checkingsAccount and savingsAccount classes inherit from the Account class.
        - Access Modifiers: score 100 if all attributes and methods are public. if at least one attribute or method is public, score greater than 0.
        increase the score the more public attributes and methods there are.

        - All empty codebases should be scored 0. If the implementation follows the diagram exactly for a specific category (i.e. no mistakes at all), the mark for that category should be 100.
        - Provide partial points for partial implementation. E.g. if 2/4 classes are there, provide 50% score.
        deduct points as necessary if the codebase does not exactly follow the requirements above.
        RESPONSE FORMAT MUST BE A JSON STRING WITH THE EXACT FOLLOWING FORMAT. DO NOT USE TRIPLE BACKTICKS. THE KEYS AND THE VALUES ARE STRINGS:
        {
            "Class Representations:": <SCORE>,
            "Relationships": <SCORE>,
            "Access Modifiers": <SCORE>
        }
            files:
            ${Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('\n')} 
        `
    }
    else if (diagram === "/2.jpg") {
        prompt = `you are a senior engineer who is experienced in system design. you are given a set of java files that 
        implement some sort of system. I want you to provide a score from 1-100 for each of the 3 categories:
        - Class Representations: score 100 if there is an Animal, Fish, Duck and Zebra class.
        - Relationships: score 100 if the Zebra, Fish and Duck classes inherit from Animal.
        - Access modifiers: score 100 if the attributes and methods of Fish are private, and all other classes have public attributes and methods.
        score partial points in for access modifiers if there are some private attributes/methods that should be public.


        - All empty codebases should be scored 0. If the implementation follows the diagram exactly for a specific category (i.e. no mistakes at all), the mark for that category should be 100.
        - Provide partial points for partial implementation. E.g. if 2/4 classes are there, provide 50% score.
        deduct points as necessary if the codebase does not exactly follow the requirements above.
        RESPONSE FORMAT MUST BE A JSON STRING WITH THE EXACT FOLLOWING FORMAT. DO NOT USE TRIPLE BACKTICKS. THE KEYS AND THE VALUES ARE STRINGS:
        {
            "Class Representations:": <SCORE>,
            "Relationships": <SCORE>,
            "Access Modifiers": <SCORE>
        }
            files:
            ${Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('\n')} 
        `
    } else {
        prompt = `you are a senior engineer who is experienced in system design. you are given a set of java files that 
        implement some sort of system. I want you to provide a score from 1-100 for each of the 3 categories:
        - Class Representations: score 100 if there is a Person, Address, Student and Professor class.
        - Relationships: score 100 if Student and Professor inherit from Person.
        - Access modifiers: score 100 if all the following are true:
         all attributes and methods in Person are public, all attributes and methods in Address are public except for the validate() method, all attributes and methods in Student are public, and the Professor's staffNumber attribute is protected and yearsOfService attribute is private.
         score partial points in access modifiers if some of these conditions are satisfied but not all of them.

        - All empty codebases should be scored 0. If the implementation follows the diagram exactly for a specific category (i.e. no mistakes at all), the mark for that category should be 100.
         - Provide partial points for partial implementation. E.g. if 2/4 classes are there, provide 50% score.
        deduct points as necessary if the codebase does not exactly follow the requirements above.
        RESPONSE FORMAT MUST BE A JSON STRING WITH THE EXACT FOLLOWING FORMAT. DO NOT USE TRIPLE BACKTICKS. THE KEYS AND THE VALUES ARE STRINGS:
        {
            "Class Representations:": <SCORE>,
            "Relationships": <SCORE>,
            "Access Modifiers": <SCORE>
        }
            files:
            ${Object.entries(files).map(([key, value]) => `${key}: ${value}`).join('\n')} 
        `
    }

    try {
        const response = await axios.post(
            OPENAI_API_URL,
            {
              model: 'gpt-4o',
              messages: [
                { role: 'user', content: prompt }
              ],
              max_tokens: 500,
              temperature: 0.7,
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
        console.error('Error communicating with OpenAI API:', error);
        return "";
    }
}
    