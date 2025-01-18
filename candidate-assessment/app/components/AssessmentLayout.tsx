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
import { PromptMap} from '../data/prompts'
import { QueryGPT } from '../api/gpt-api/query-gpt'
import Modal from './Modal'
const inter = Inter({ subsets: ['latin'] })
import { updateDocument } from '../api/database/utils'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const difficultyColors = {
  'Easy': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'Hard': 'bg-red-500'
}

// First, define an interface for the props
interface AssessmentLayoutProps {
  timer: number;
  setTimer: (timer: number) => void; // Changed return type from string to void
}

// Then modify the component to accept props object
export default function AssessmentLayout({ timer, setTimer }: AssessmentLayoutProps) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenges[0])
  const [currentFile, setCurrentFile] = useState(Object.keys(challenges[0].files)[0])
  const [files, setFiles] = useState(challenges[0].files)
  const [feedback, setFeedback] = useState<string>('') 
  const [challengeDomain, setChallengeDomain] = useState<string>('');
  const [domainConfirmed, setDomainConfirmed] = useState(false);
  const hasMounted = useRef(false); // Ref to track initial render
  const [gptChallenge, setGptChallenge] = useState<Challenge | null>(null);
  const [gptChallengeLoaded, setGptChallengeLoaded] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Format time function
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Timer effect with modal
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPageVisible(false);
        setShowModal(true);
        updateDocument(localStorage.getItem('userId'), 'User left the assessment page @ ' + formatTime(timer));
      } else {
        setIsPageVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (isPageVisible) {
        setTimer(prevTime => prevTime + 1);
      }
    }, 1000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isPageVisible]);

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (hasMounted.current) {
      // Only run effect after the initial render
      const prompt = PromptMap[challengeDomain];
      console.log(`the prompt is ${prompt}`);
      const query = async () => {
        const response = await QueryGPT(prompt);
    console.log(`the response is ${response}`);
    const responseObj = JSON.parse(response) as Challenge;
    console.log(`the challenge is ${JSON.stringify(responseObj)}`)
    setGptChallenge(responseObj);
    setGptChallengeLoaded(true);
    }

    query();
    } else {
      hasMounted.current = true; // Mark that the component has mounted
    }
  }, [domainConfirmed]);

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

  const handleConfirm = () => {
    setDomainConfirmed(true);
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
          <div className="text-white bg-gray-800 px-4 py-2 rounded-lg">
            Time: {formatTime(timer)}
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            disabled={!gptChallengeLoaded}
            onClick={() => {handleChallengeChange(gptChallenge as Challenge)}} 
            className={`px-4 py-2 rounded-lg flex items-center gap-2 bg-gray-800 hover:bg-gray-700`}
          >
            AI-Generated Challenge
          </button>
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
          <div className="relative mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger 
                disabled={domainConfirmed} 
                className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-gray-200 disabled:text-gray-500 hover:text-white disabled:hover:text-gray-500 bg-gray-800 disabled:hover:bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {challengeDomain ? challengeDomain : 'Select a Challenge Domain'}
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent sideOffset={5} className="bg-gray-800 border-gray-700" align="start">
                <DropdownMenuItem onClick={() => setChallengeDomain('Object Oriented Programming')} className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer">
                  Object Oriented Programming
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChallengeDomain('UML Analysis and Implementation')} className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer">
                  UML Analysis and Implementation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChallengeDomain('Unit Testing')} className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer">
                  Unit Testing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChallengeDomain('Technical Comprehension and Communication')} className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer">
                  Technical Comprehension and Communication
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <button 
              disabled={challengeDomain === ''}
              onClick={handleConfirm} 
              className="w-full mt-2 px-4 py-2 text-sm font-medium text-gray-200 disabled:text-gray-500 hover:text-white disabled:hover:text-gray-500 bg-gray-800 disabled:hover:bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Confirm
            </button>
          </div>
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
            expectedFunctionality={currentChallenge.description}
          />
          {feedback && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Feedback</h2>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal 
          message="You have left the assessment page. This will be recorded." 
          onClose={closeModal}
        />
      )}
    </div>
  )
}

