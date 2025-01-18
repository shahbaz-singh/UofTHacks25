import { Button } from "./ui/button"
import { Send } from 'lucide-react'
import { useState } from 'react'

interface SubmitSolutionProps {
  files: { [key: string]: string }
  setFeedback: (feedback: string) => void
}

interface TestEnvironment {
  require: () => Record<string, unknown>
  module: {
    exports: {
      calculateItemTotal?: (quantity: number, price: number, discount: number) => number
    }
  }
  console: { log: () => void }
  Intl: { NumberFormat: () => { format: (n: number) => string } }
}

export default function SubmitSolution({ files, setFeedback }: SubmitSolutionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const testCalculation = (code: string) => {
    try {
      // Create a safe testing environment
      const testEnv: TestEnvironment = {
        require: () => ({}),
        module: { exports: {} },
        console: { log: () => {} },
        Intl: { NumberFormat: () => ({ format: (n: number) => n.toFixed(2) }) }
      }
      
      // Execute the calculator code
      new Function('module', 'require', code)(testEnv.module, testEnv.require)
      const { calculateItemTotal } = testEnv.module.exports

      if (!calculateItemTotal) {
        return 'Error: calculateItemTotal function not found. Make sure you export the function correctly.'
      }

      // Test cases
      const testCases = [
        {
          quantity: 2,
          price: 20,
          discount: 0.2,
          expected: 32 // (20 * 2) * (1 - 0.2) = 32
        },
        {
          quantity: 1,
          price: 50,
          discount: 0.1,
          expected: 45 // 50 * (1 - 0.1) = 45
        },
        {
          quantity: 3,
          price: 15,
          discount: 0.3,
          expected: 31.5 // (15 * 3) * (1 - 0.3) = 31.5
        }
      ]

      // Run tests
      for (const test of testCases) {
        const result = calculateItemTotal(test.quantity, test.price, test.discount)
        if (Math.abs(result - test.expected) > 0.01) { // Allow for small floating point differences
          return `Test failed: Expected $${test.expected} but got $${result.toFixed(2)} for quantity: ${test.quantity}, price: $${test.price}, discount: ${test.discount * 100}%`
        }
      }

      return 'Success! All test cases passed. The discount calculation has been fixed.'
    } catch (error) {
      return `Error executing code: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    try {
      const result = testCalculation(files['cartCalculator.js'])
      setFeedback(result)
    } catch (error) {
      setFeedback('An error occurred while testing your solution.')
      console.error('Testing error:', error)
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
        {isSubmitting ? 'Testing...' : 'Submit Solution'}
      </Button>
    </div>
  )
}

