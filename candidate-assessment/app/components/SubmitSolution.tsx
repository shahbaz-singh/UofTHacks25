import { Button } from "./ui/button"
import { Send } from 'lucide-react'

interface SubmitSolutionProps {
  currentFile: string
  files: { [key: string]: string }
  setFeedback: (feedback: string) => void
}

function safeExecute(code: string) {
  try {
    const result = new Function(code)();
    return result;
  } catch (e) {
      return 'Error! Please check your code and try again.';
  }
}

export default function SubmitSolution({ currentFile, files, setFeedback }: SubmitSolutionProps) {
  const handleSubmit = () => {
    /*
    if (files['math.js'].includes('return a + b;')) {
      setFeedback('Great job! You\'ve successfully fixed the bug in the math.js file.')
    } else {
      setFeedback('The bug is still present in the math.js file. Please try again.')
    }
    */
    const result = safeExecute(currentFile);
    setFeedback(result);
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Submit Your Solution</h2>
      <p className="mb-4">When you're ready, click the button below to submit your solution.</p>
      <Button onClick={handleSubmit} className="w-full">
        <Send className="mr-2" size={16} />
        Submit Solution
      </Button>
    </div>
  )
}

