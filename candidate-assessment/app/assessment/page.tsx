'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AssessmentLayout from '../components/AssessmentLayout'
import { challenges } from '../data/challenges'
import { time } from 'console'
import { Timestamp } from 'firebase/firestore'
import EyeTracker from '../components/EyeTracker'

export default function AssessmentPage() {
  const router = useRouter()
  const [timer, setTimer] = useState(0);
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
    localStorage.setItem('timeSpent', '' + timer);
    router.push('/analytics')
  }

  return (
    <div>
      <button
        onClick={handleExit}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Exit Assessment
      </button>
      <AssessmentLayout timer={timer} setTimer={setTimer} />
      <EyeTracker />
    </div>
  )
}
