'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AssessmentLayout from '../components/AssessmentLayout'
import { challenges } from '../data/challenges'

export default function AssessmentPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is registered
    const userName = localStorage.getItem('userName')
    if (!userName) {
      // If not registered, redirect to registration
      router.push('/')
    }
  }, [router])

  const handleExit = () => {
    // Clear user data and redirect to registration
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    router.push('/')
  }

  return (
    <div>
      <button
        onClick={handleExit}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Exit Assessment
      </button>
      <AssessmentLayout {...challenges[0]} />
    </div>
  )
} 