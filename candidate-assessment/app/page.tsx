"use client"

import AssessmentLayout from './components/AssessmentLayout'

export default function Home() {
    

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <AssessmentLayout />
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