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
import { challenges, Challenge, UMLChallenge } from '../data/challenges'
import { Badge } from '@/app/components/ui/badge'
import { Inter } from 'next/font/google'
import LoadingScreen from './LoadingScreen'
import { mathChallenge, animalChallenge, getNextDocumentationChallenge } from '../data/documentation-challenges'
import DocumentationMetrics from './DocumentationMetrics'
import { socialMediaChallenge } from '../data/unit-test-challenges'
import TestResults, { TestResult } from './TestResults'
import UMLViewer from './UMLViewer'
const inter = Inter({ subsets: ['latin'] })
import { UmlChallenges } from '../data/challenges'
import UMLScoreDisplay from './UMLScoreDisplay'
import { useRouter } from 'next/navigation'
import Modal from './Modal'


const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const difficultyColors = {
  'Easy': 'bg-green-500',
  'Medium': 'bg-yellow-500',
  'Hard': 'bg-red-500'
}

const parseTestResults = (feedback: string): TestResult => {
  try {
    // Parse the JSON string into an object
    const results = JSON.parse(feedback);
    return {
      passedTests: results.passedTests || 0,
      totalTests: results.totalTests || 0,
      failedTests: results.failedTests || [],
      coverage: results.coverage || 0,
      creativity: results.creativity || 0,
      feedback: results.feedback || 'No feedback available'
    };
  } catch (error) {
    console.error('Error parsing test results:', error);
    return {
      passedTests: 0,
      totalTests: 0,
      failedTests: [],
      coverage: 0,
      creativity: 0,
      feedback: 'Error parsing test results'
    };
  }
};

export default function AssessmentLayout() {
  const router = useRouter()
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | UMLChallenge>(challenges[0])
  const [currentFile, setCurrentFile] = useState(Object.keys(challenges[0].files)[0])
  const [files, setFiles] = useState(challenges[0].files)
  const [feedback, setFeedback] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChallengeType, setSelectedChallengeType] = useState<string>('Select Challenge Type')
  const [currentUMLImage, setCurrentUMLImage] = useState('/1.jpg');
  const [dynamicFiles, setDynamicFiles] = useState<Record<string, string>>({
    'solution.ts': '// Write your solution here'
  })
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const startingUMLChallenge = UmlChallenges['/1.jpg'];


  const handleChallengeChange = (challenge: Challenge) => {
    setIsLoading(true)
    setCurrentChallenge(challenge)
    setFiles(challenge.files)
    setCurrentFile(Object.keys(challenge.files)[0])
    setFeedback('')
    setSelectedChallengeType('Select Challenge Type')
  }

  const handleCodeChange = (value: string | undefined) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: value || ''
    }))
  }

  const handleAddFile = (fileName: string) => {
    setDynamicFiles(prev => ({
      ...prev,
      [fileName]: '// New file'
    }))
    setCurrentFile(fileName)
  }

  const handleDeleteFile = (fileName: string) => {
    const newDynamicFiles = { ...dynamicFiles }
    delete newDynamicFiles[fileName]
    setDynamicFiles(newDynamicFiles)
    
    // If the deleted file was the current file, switch to another file
    if (fileName === currentFile) {
      const remainingFiles = Object.keys(newDynamicFiles)
      if (remainingFiles.length > 0) {
        setCurrentFile(remainingFiles[0])
      }
    }
  }

  const handleChallengeTypeChange = (type: string) => {
    setSelectedChallengeType(type);
    if (type === 'UML Diagram') {
      setCurrentChallenge(startingUMLChallenge);
      if (!dynamicFiles[Object.keys(startingUMLChallenge.files)[0]]) {
        setDynamicFiles(startingUMLChallenge.files);
      }
      setFiles(startingUMLChallenge.files);
      setCurrentFile(Object.keys(startingUMLChallenge.files)[0]);
    } else if (type === 'Documentation') {
      handleChallengeChange(getNextDocumentationChallenge(currentChallenge.id));
    }
  }

  const handleUMLImageChange = (imagePath: string) => {
    setCurrentUMLImage(imagePath);
    const newChallenge = UmlChallenges[imagePath];
    setCurrentChallenge(newChallenge);
    setFiles(newChallenge.files);
    setCurrentFile(Object.keys(newChallenge.files)[0]);
    setDynamicFiles(newChallenge.files);
    setFeedback('');
  }

  const handleExit = () => {
    router.push('/analytics')
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPageVisible(false);
        setShowModal(true); // Show modal when page is hidden
      } else {
        setIsPageVisible(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
          <button
            onClick={handleExit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Exit Assessment
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              {selectedChallengeType}
              <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleChallengeTypeChange('UML Diagram')}
              >
                UML Diagram
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleChallengeChange(getNextDocumentationChallenge(currentChallenge.id))}
              >
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-gray-200 hover:text-white hover:bg-gray-700 cursor-pointer"
                onClick={() => handleChallengeChange(socialMediaChallenge)}
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
          {selectedChallengeType === 'UML Diagram' ? (
            <div className="space-y-4">
              <UMLViewer imagePath={currentUMLImage} />
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleUMLImageChange(`/${num}.jpg`)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      currentUMLImage === `/${num}.jpg`
                        ? 'bg-gray-700 text-white'
                        : 'bg-gray-800 text-gray-200 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    Diagram {num}
                  </button>
                ))}
              </div>
              <FileExplorer 
                files={Object.keys(dynamicFiles)} 
                currentFile={currentFile} 
                setCurrentFile={setCurrentFile}
                onAddFile={handleAddFile}
                onDeleteFile={handleDeleteFile}
              />
            </div>
          ) : (
            <FileExplorer 
              files={Object.keys(files)} 
              currentFile={currentFile} 
              setCurrentFile={setCurrentFile} 
            />
          )}
          <BugDescription 
            description={currentChallenge.description} 
            isUMLChallenge={currentChallenge.id === 'uml-challenge'} 
          />
        </div>
        <div className="col-span-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 text-sm font-medium">{currentFile}</div>
            <MonacoEditor
              height="500px"
              language={selectedChallengeType === 'UML Diagram' ? 'java' : 'javascript'}
              theme="vs-dark"
              value={selectedChallengeType === 'UML Diagram' ? dynamicFiles[currentFile] : files[currentFile]}
              onChange={(value) => {
                if (selectedChallengeType === 'UML Diagram') {
                  setDynamicFiles(prev => ({
                    ...prev,
                    [currentFile]: value || ''
                  }))
                } else {
                  handleCodeChange(value)
                }
              }}
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
            files={currentChallenge.id === 'uml-challenge' ? dynamicFiles : files} 
            setFeedback={setFeedback} 
            expectedFunctionality={currentChallenge.description}
            diagram={currentUMLImage}
          />
          {currentChallenge.id === 'uml-challenge' && feedback && (
            <div className="mt-4">
              <UMLScoreDisplay feedback={feedback} />
            </div>
          )}
          {feedback && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">
                {currentChallenge.id === 'social-media-tests' ? 'Test Results' : 'Documentation Analysis'}
              </h2>
              {(currentChallenge.id === 'documentation-challenge-math' || 
                currentChallenge.id === 'documentation-challenge-animals') ? (
                <DocumentationMetrics feedback={feedback} />
              ) : currentChallenge.id === 'social-media-tests' ? (
                <TestResults results={parseTestResults(feedback)} />
              ) : (
                <p className="whitespace-pre-line">{feedback}</p>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal 
          message="You have left the assessment page. This will be recorded." 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

