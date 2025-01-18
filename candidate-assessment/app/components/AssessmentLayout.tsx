'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import BugDescription from './BugDescription'
import SubmitSolution from './SubmitSolution'
import FileExplorer from './FileExplorer'
import { challenges, Challenge } from '../data/challenges'
import { Badge } from '@/app/components/ui/badge'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const difficultyColors = {
  'Easy': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'Hard': 'bg-red-500'
}

export default function AssessmentLayout(gptChallenge: Challenge) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenges[0])
  const [currentFile, setCurrentFile] = useState(Object.keys(challenges[0].files)[0])
  const [files, setFiles] = useState(challenges[0].files)
  const [feedback, setFeedback] = useState<string>('')

  const handleChallengeChange = (challenge: Challenge) => {
    setCurrentChallenge(challenge)
    setFiles(challenge.files)
    setCurrentFile(Object.keys(challenge.files)[0])
    setFeedback('')
  }

  const handleCodeChange = (value: string | undefined) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: value || ''
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Software Engineer Assessment</h1>
        <div className="flex gap-2">
            <button onClick={() => {handleChallengeChange(gptChallenge)}} className={`px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-800 hover:bg-gray-700`}>AI-Generated Challenge</button>
          {challenges.map(challenge => (
            <button
              key={challenge.id}
              onClick={() => handleChallengeChange(challenge)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                currentChallenge.id === challenge.id 
                  ? 'bg-gray-700' 
                  : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {challenge.title}
              <Badge className={difficultyColors[challenge.difficulty]}>
                {challenge.difficulty}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <FileExplorer 
            files={Object.keys(files)} 
            currentFile={currentFile} 
            setCurrentFile={setCurrentFile} 
          />
          <BugDescription description={currentChallenge.description} />
        </div>
        <div className="col-span-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 text-sm font-medium">{currentFile}</div>
            <MonacoEditor
              height="500px"
              language="javascript"
              theme="vs-dark"
              value={files[currentFile as keyof typeof files]}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                readOnly: false,
                cursorStyle: 'line',
              }}
            />
          </div>
        </div>
        <div className="col-span-3">
          <SubmitSolution 
            currentChallenge={currentChallenge}
            files={files} 
            setFeedback={setFeedback} 
          />
          {feedback && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Feedback</h2>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

