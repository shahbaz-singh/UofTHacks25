'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AssessmentStart() {
  const router = useRouter()
  const [isConfirmed, setIsConfirmed] = useState(false)

  const handleConfirm = () => {
    setIsConfirmed(true)
    setTimeout(() => {
      router.push('/assessment')
    }, 2000) // Redirect after 2 seconds
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {!isConfirmed ? (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-6">Get Ready!</h2>
          <p className="text-gray-700 mb-6">
            The following assessment will be timed. Are you ready to start?
          </p>
          <button
            onClick={handleConfirm}
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Yes, I'm Ready
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-3xl font-bold mb-6">Starting Assessment...</h2>
        </div>
      )}
    </div>
  )
} 