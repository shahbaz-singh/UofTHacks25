import { Button } from "@/components/ui/button"
import { Send } from 'lucide-react'

interface SubmitSolutionProps {
  files: { [key: string]: string }
  setFeedback: (feedback: string) => void
}

export default function SubmitSolution({ files, setFeedback }: SubmitSolutionProps) {
  const handleSubmit = () => {
    // This is a simple validation. In a real-world scenario, you'd want to run tests or use a more sophisticated validation method.
    if (files['math.py'].includes('return a + b')) {
      setFeedback('Great job! You\'ve successfully fixed the bug in the math.py file.')
    } else {
      setFeedback('The bug is still present in the math.py file. Please try again.')
    }
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