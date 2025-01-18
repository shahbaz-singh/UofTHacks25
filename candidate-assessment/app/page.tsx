'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AssessmentLayout from './components/AssessmentLayout.tsx'
import { challenges } from './data/challenges.ts'

export default function AssessmentPage() {
  const router = useRouter()
  const [isFocused, setIsFocused] = useState(true)

  useEffect(() => {
    const userName = localStorage.getItem('userName')
    if (!userName) {
      router.push('/')
    }

    const script = document.createElement('script')
    script.src = 'https://webgazer.cs.brown.edu/webgazer.js'
    script.async = true
    script.onload = () => {
      if (window.webgazer) {
        window.webgazer.setGazeListener((data) => {
          if (data == null) return

          const { x, y } = data
          const screenWidth = window.innerWidth
          const screenHeight = window.innerHeight

          if (x < 0 || x > screenWidth || y < 0 || y > screenHeight) {
            setIsFocused(false)
          } else {
            setIsFocused(true)
          }
        }).begin()

        // Position the camera output
        window.webgazer.showVideoPreview(true).showPredictionPoints(true)
        const videoElement = document.getElementById('webgazerVideoFeed')
        if (videoElement) {
          videoElement.style.position = 'absolute'
          videoElement.style.bottom = '4px'
          videoElement.style.right = '4px'
          videoElement.style.width = '100px'
          videoElement.style.height = '75px'
          videoElement.style.border = '2px solid black'
        }
      } else {
        console.error('WebGazer failed to load.')
      }
    }
    document.body.appendChild(script)

    return () => {
      window.webgazer.end()
      document.body.removeChild(script)
    }
  }, [router])

  const handleExit = () => {
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    router.push('/')
  }

  return (
    <div className={`relative min-h-screen ${isFocused ? 'bg-gray-100' : 'bg-red-500'} flex flex-col items-center justify-center`}>
      <button
        onClick={handleExit}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Exit Assessment
      </button>
      <AssessmentLayout {...challenges[0]} />
      <div
        className={`absolute bottom-4 right-4 w-16 h-16 ${
          isFocused ? 'border-4 border-dotted border-green-500' : 'border-4 border-solid border-red-500'
        }`}
      />
    </div>
  )
} 