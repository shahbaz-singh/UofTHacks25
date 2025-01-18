'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AssessmentLayout from '../components/AssessmentLayout'
import { challenges } from '../data/challenges'
import EyeTracker from '../components/EyeTracker'

export default function AssessmentPage() {
  const router = useRouter()

  useEffect(() => {
    const userName = localStorage.getItem('userName')
    if (!userName) {
      router.push('/')
    } else if (performance.getEntriesByType('navigation')[0].type === 'navigate') {
      // Refresh the page only if navigated from another page
      window.location.reload()
    }
  }, [router])

  const handleExit = () => {
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
      <EyeTracker />
    </div>
  )
}
