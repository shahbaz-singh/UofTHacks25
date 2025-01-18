export interface PromptMapInterface {
    [key: string]: string
}

export const PromptMap: PromptMapInterface = {
    'Object Oriented Programming': `
        provide me with a file for a javascript program that has a bug in it. the goal is that we provide 
        this small codebase to the user for them to modify the code and fix the bug. the format of your output
        should be a string in json format (DO NOT USE TRIPLE BACKTICKS) that satisfies the following interface
        structure: 
        {
  id: string
  title: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  files: { [key: string]: string }
}
   the id attribute should have the value "ai-challenge". the description attribute should describe the expected functionality of the snippet of code so that the user knows 
   what to expect when they correctly fix the codebase. the title attribute should be the title of the problem. 
do not output anything else besides the string in json format.
        `,

    'UML Analysis and Implementation': 'UML Analysis and Implementation',
    'Unit Testing': 'Unit Testing',
    'Technical Comprehension and Communication': 'Technical Comprehension and Communication'
}