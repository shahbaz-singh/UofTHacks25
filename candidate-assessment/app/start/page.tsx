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
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      {!isConfirmed ? (
        <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-orange-500">Get Ready!</h2>
          <p className="text-gray-700 mb-6">
            The following assessment will be timed and will last 60 minutes. Please ensure you are prepared before starting.
          </p>
          <button
            onClick={handleConfirm}
            className="bg-orange-500 text-white px-8 py-3 rounded hover:bg-orange-600 transition"
          >
            Yes, I'm Ready
          </button>
        </div>
      ) : (
        <div className="bg-white p-10 rounded-lg shadow-lg text-center max-w-md">
          <h2 className="text-4xl font-bold mb-6 text-orange-500">Starting Assessment...</h2>
        </div>
      )}
    </div>
  )
} 