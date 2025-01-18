"use client"

import AssessmentLayout from './components/AssessmentLayout'
import { QueryGPT } from './api/gpt-api/query-gpt'
import { useEffect, useState } from 'react'
import { BugDescriptionProps } from './components/BugDescription'
import { Challenge } from './data/challenges'

export default function Home() {
    let BugDescription: BugDescriptionProps = { description: "" }; 
    const [gptChallenge, setGptChallenge] = useState<Challenge | null>(null);

    useEffect(() => {
        const query = async () => {
            const response = await QueryGPT(`
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
   the description attribute should describe the expected functionality of the snippet of code so that the user knows 
   what to expect when they correctly fix the codebase. the title attribute should be the title of the problem. 
do not output anything else besides the string in json format.
        `);
        console.log(`the response is ${response}`);
        const responseObj = JSON.parse(response) as Challenge;
        console.log(`the challenge is ${JSON.stringify(responseObj)}`)
        setGptChallenge(responseObj);
        }
    
        query();

    }, []);

    if (!gptChallenge) {
        return <div>Loading...</div>;
    }
    

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <AssessmentLayout {...gptChallenge}/>
    </main>
  )
}

// async function query() {
//     const res = await QueryGPT(`
//         provide me with a file for a javascript program that has a bug in it. the goal is that we provide 
//         this small codebase to the user for them to modify the code and fix the bug. the format of your output
//         should be a json string where the key is the file and the value is the content for that file. provide
//         a short comment in the content of the file describing the expected functionality of the program. do 
//         not output anything else.
//         `);
//     console.log(res);
// }

// export default function Home() {
//     return (
//         <button onClick={query}>hello world</button>
//     );
// }