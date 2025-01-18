import { Button } from "./ui/button"
import { Send } from 'lucide-react'
import { useState } from 'react'

interface SubmitSolutionProps {
  files: { [key: string]: string }
  setFeedback: (feedback: string) => void
}

export default function SubmitSolution({ files, setFeedback }: SubmitSolutionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      
      const response = await fetch('/api/validate-solution', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: files['math.py']
        })
      })

      const data = await response.json()

      if (response.ok) {
        setFeedback(data.message || 'Great job! Your solution passed all tests.')
      } else {
        setFeedback(data.error || 'Your solution did not pass all tests. Please try again.')
      }
    } catch (error) {
      setFeedback('An error occurred while submitting your solution. Please try again.')
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Submit Your Solution</h2>
      <p className="mb-4">When you're ready, click the button below to submit your solution.</p>
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isSubmitting}
      >
        <Send className="mr-2" size={16} />
        {isSubmitting ? 'Submitting...' : 'Submit Solution'}
      </Button>
    </div>
  )
}

