'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import BugDescription from './BugDescription'
import SubmitSolution from './SubmitSolution'
import FileExplorer from './FileExplorer'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const mockBugData = {
  description: "There's a bug in the following code that causes the add function to return incorrect results for certain inputs. The bug is in the 'math.py' file.",
  files: {
    'math.py': `def add(a, b):
    return a - b  # Bug: using subtraction instead of addition`.trim(),
    'test.py': `from math import add

print(add(5, 3))  # Expected: 8, Actual: 2`.trim(),
    'main.py': `from math import add

def print_sum(a, b):
    print(f"The sum of {a} and {b} is {add(a, b)}")

print_sum(5, 3)`.trim(),
  }
}

export default function AssessmentLayout() {
  const [currentFile, setCurrentFile] = useState('math.py')
  const [files, setFiles] = useState(mockBugData.files)
  const [feedback, setFeedback] = useState('')

  const handleCodeChange = (value: string | undefined) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: value || ''
    }))
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Software Engineer Assessment</h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <FileExplorer files={Object.keys(files)} currentFile={currentFile} setCurrentFile={setCurrentFile} />
          <BugDescription description={mockBugData.description} />
        </div>
        <div className="col-span-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 text-sm font-medium">{currentFile}</div>
            <MonacoEditor
              height="500px"
              language="python"
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
          <SubmitSolution files={files} setFeedback={setFeedback} />
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

