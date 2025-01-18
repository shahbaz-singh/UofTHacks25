'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { Send } from 'lucide-react'
import { QueryGPT } from "../api/gpt-api/query-gpt"

interface DocumentationSubmissionProps {
  files: { [key: string]: string }
  setFeedback: (feedback: string) => void
}

export default function DocumentationSubmission({ files, setFeedback }: DocumentationSubmissionProps) {
  const [documentation, setDocumentation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const prompt = `
        I have a codebase and user-provided documentation. Please evaluate the documentation quality and provide a score out of 10.
        
        Evaluation criteria:
        1. Completeness (covers all functions and features)
        2. Clarity (easy to understand)
        3. Examples (includes usage examples)
        4. Format (follows documentation standards)
        5. Technical accuracy
        
        Codebase:
        ${Object.entries(files).map(([filename, content]) => `
        --- ${filename} ---
        ${content}
        `).join('\n')}
        
        User's Documentation:
        ${documentation}
        
        Please provide:
        1. Score (0-10)
        2. Specific feedback on strengths
        3. Areas for improvement
        4. Missing critical information
        
        Format the response as:
        Score: X/10
        Strengths:
        - point 1
        - point 2
        Areas for Improvement:
        - point 1
        - point 2
      `

      const feedback = await QueryGPT(prompt)
      setFeedback(feedback)
    } catch (error) {
      setFeedback('Error evaluating documentation')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <textarea
        className="w-full h-64 p-4 bg-gray-700 text-white rounded-lg resize-none"
        placeholder="Add your documentation here..."
        value={documentation}
        onChange={(e) => setDocumentation(e.target.value)}
      />
      <Button 
        onClick={handleSubmit} 
        className="w-full"
        disabled={isSubmitting}
      >
        <Send className="mr-2" size={16} />
        {isSubmitting ? 'Evaluating...' : 'Submit Documentation'}
      </Button>
    </div>
  )
} 