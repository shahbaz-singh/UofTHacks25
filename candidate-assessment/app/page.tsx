'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Clear any existing registration data
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')

    // Redirect to register
    router.push('/register')
  }, [router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>
  )
} 