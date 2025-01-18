'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AssessmentLayout from '../components/AssessmentLayout'
import { challenges } from '../data/challenges'
import { time } from 'console'
import { Timestamp } from 'firebase/firestore'

export default function AssessmentPage() {
  const router = useRouter()
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Check if user is registered
    const userName = localStorage.getItem('userName')
    if (!userName) {
      // If not registered, redirect to registration
      router.push('/')
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
    </div>
  )
} 