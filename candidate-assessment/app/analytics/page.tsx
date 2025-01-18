'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Modal from './Modal'; // Import the modal component

// Dynamically import Analytics with no SSR
const Analytics = dynamic(() => import('./Analytics'), {
  ssr: false,
});

export default function AnalyticsPage() {
  const sampleMetrics = {
    timeSpent: 100,
    hintsUsed: 2,
    successRate: 70,
    efficiency: 90,
    complexity: 75,
  };

  const [timer, setTimer] = useState(0);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPageVisible(false);
      } else {
        setIsPageVisible(true);
      }
    };

    // Listen to visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (isPageVisible) {
        setTimer(prevTime => prevTime + 1);
      }
    }, 1000);

    // Cleanup on component unmount
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [isPageVisible]);

  useEffect(() => {
    // Show modal when the user returns to the page
    if (!isPageVisible) {
      setShowModal(true);
    }
  }, [isPageVisible]);

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Convert the timer (seconds) into HH:MM:SS format
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    // Format with leading zeros if needed
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Your Coding Performance
          </h1>
          <p className="mt-2 text-gray-600">
            Track your progress and identify areas for improvement
          </p>
          <p className="mt-2 text-gray-600">
            Time spent on page: {formatTime(timer)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Analytics metrics={sampleMetrics} />
        </div>
      </div>

      {showModal && <Modal message="You have violated the rules of the exam." onClose={closeModal} />}
    </div>
  );
}
