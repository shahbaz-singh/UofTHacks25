"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../api/database/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Add user to Firestore
      const docRef = await addDoc(collection(db, 'Users'), {
        name,
        email,
        questionsEncountered: [],
        scores: [],
      })

      // Store user info in localStorage
      localStorage.setItem('userName', name)
      localStorage.setItem('userEmail', email)
      localStorage.setItem('userId', docRef.id)

      // Redirect to assessment page
      router.push('/assessment')
    } catch (e) {
      console.error('Error adding document to Firestore:', e)
      alert('Failed to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex flex-col">
      {/* LeetCode-style Header */}
      <header className="bg-[#282828] border-b border-[#3E3E3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-[#FFA116] text-2xl font-bold">YeetCode</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 bg-[#1A1A1A]">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Start Your Assessment
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Please provide your details to begin
            </p>
          </div>
          
          <div className="bg-[#282828] rounded-lg shadow-xl p-8 border border-[#3E3E3E]">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-[#3E3E3E] rounded-md shadow-sm bg-[#1A1A1A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFA116] focus:border-transparent sm:text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-[#3E3E3E] rounded-md shadow-sm bg-[#1A1A1A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFA116] focus:border-transparent sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FFA116] hover:bg-[#FFB347] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFA116] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    'Start Assessment'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#3E3E3E]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#282828] text-gray-400">
                    Important Note
                  </span>
                </div>
              </div>
              <p className="mt-4 text-xs text-center text-gray-400">
                By continuing, you agree to complete the assessment honestly and independently.
                Your responses will be used to evaluate your technical skills.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 