'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import BugDescription from './BugDescription'
import SubmitSolution from './SubmitSolution'
import FileExplorer from './FileExplorer'
import CodeOutput from './CodeOutput'
import { loadPyodide } from 'pyodide'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const mockBugData = {
  description: "There's a bug in the following Python code that causes the sum function to return incorrect results for certain inputs. The bug is in the 'math.py' file.",
  files: {
    'math.py': `
def sum(a, b):
    return a - b

print(sum(5, 3))  # Expected: 8, Actual: 2
    `.trim(),
    'test.py': `
from math import sum

print(sum(5, 3))  # Expected: 8, Actual: 2
    `.trim(),
    'main.py': `
from math import sum

def print_sum(a, b):
    print(f"The sum of {a} and {b} is {sum(a, b)}")

print_sum(5, 3)
    `.trim(),
  }
}

export default function AssessmentLayout() {
  const [currentFile, setCurrentFile] = useState('math.py')
  const [files, setFiles] = useState(mockBugData.files)
  const [feedback, setFeedback] = useState('')
  const [output, setOutput] = useState('')
  const [pyodide, setPyodide] = useState<any>(null)

  useEffect(() => {
    async function loadPyodideInstance() {
      const pyodideInstance = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.1/full/"
      });
      setPyodide(pyodideInstance);
    }
    loadPyodideInstance();
  }, []);

  const handleCodeChange = (value: string | undefined) => {
    setFiles(prev => ({
      ...prev,
      [currentFile]: value || ''
    }))
  }

  const runCode = async () => {
    if (!pyodide) {
      setOutput("Pyodide is still loading. Please wait.");
      return;
    }

    try {
      pyodide.runPython(`
import sys
import io

sys.stdout = io.StringIO()
      `);

      pyodide.runPython(files[currentFile]);
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      setOutput(stdout);
    } catch (error) {
      setOutput(`Error: ${(error as Error).message}`);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Python Bug Assessment</h1>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <FileExplorer files={Object.keys(files)} currentFile={currentFile} setCurrentFile={setCurrentFile} />
          <BugDescription description={mockBugData.description} />
        </div>
        <div className="col-span-6">
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 text-sm font-medium">{currentFile}</div>
            <MonacoEditor
              height="400px"
              language="python"
              theme="vs-dark"
              value={files[currentFile]}
              onChange={handleCodeChange}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                cursorStyle: 'line',
              }}
            />
          </div>
          <div className="mt-4">
            <button
              onClick={runCode}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Run Code
            </button>
          </div>
          <CodeOutput output={output} />
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