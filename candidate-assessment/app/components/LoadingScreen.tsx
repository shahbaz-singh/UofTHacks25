'use client'

import { useEffect, useState } from 'react'

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [dots, setDots] = useState('')

  useEffect(() => {
    // Animate dots
    const dotsInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)

    // Complete loading after 3.5 seconds
    const timer = setTimeout(() => {
      onLoadingComplete()
    }, 3500)

    return () => {
      clearInterval(dotsInterval)
      clearTimeout(timer)
    }
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[#FFA116] mb-4">YeetCode</h1>
        <p className="text-xl text-white">
          Calling AI Generating Code Base{dots}
        </p>
      </div>
    </div>
  )
} 