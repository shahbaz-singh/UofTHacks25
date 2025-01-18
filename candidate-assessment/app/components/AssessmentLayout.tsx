'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import BugDescription from './BugDescription'
import SubmitSolution from './SubmitSolution'
import FileExplorer from './FileExplorer'
import { challenges, Challenge } from '../data/challenges'
import { Badge } from '@/app/components/ui/badge'
import { Inter } from 'next/font/google'
import LoadingScreen from './LoadingScreen'
import { mathChallenge, animalChallenge, getRandomDocumentationChallenge } from '../data/documentation-challenges'
import DocumentationMetrics from './DocumentationMetrics'
const inter = Inter({ subsets: ['latin'] })

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const difficultyColors = {
  'Easy': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'Hard': 'bg-red-500'
}



export default function AssessmentLayout() {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenges[0])
  const [currentFile, setCurrentFile] = useState(Object.keys(challenges[0].files)[0])
  const [files, setFiles] = useState(challenges[0].files)
  const [feedback, setFeedback] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  const handleChallengeChange = (challenge: Challenge) => {
    setIsLoading(true)
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

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-6">
          <h1 className={`text-3xl font-[800] tracking-tight ${inter.className}`}>
            <span className="text-[#FFA116]">Y</span>
            <span className="text-white">eet</span>
            <span className="text-[#FFA116]">Code</span>
          </h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              Select Challenge Type
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer"
              >
                UML Diagram
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleChallengeChange(getRandomDocumentationChallenge())}
              >
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer"
              >
                Unit Tests
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2">
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
            {currentFile === 'README.md' ? (
              <textarea
                className="w-full h-[500px] p-4 bg-gray-800 text-white font-mono text-sm resize-none focus:outline-none"
                value={files[currentFile]}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
              />
            ) : (
              <MonacoEditor
                height="500px"
                language="javascript"
                theme="vs-dark"
                value={files[currentFile]}
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
            )}
          </div>
        </div>
        <div className="col-span-3">
          <SubmitSolution 
            currentChallenge={currentChallenge}
            files={files} 
            setFeedback={setFeedback} 
            expectedFunctionality={currentChallenge.description}
          />
          {feedback && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Documentation Analysis</h2>
              {(currentChallenge.id === 'documentation-challenge-math' || 
                currentChallenge.id === 'documentation-challenge-animals') ? (
                <DocumentationMetrics feedback={feedback} />
              ) : (
                <p className="whitespace-pre-line">{feedback}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

