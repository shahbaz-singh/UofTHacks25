'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getDocument } from '../api/database/utils'

// Dynamically import Analytics with no SSR
const Analytics = dynamic(() => import('./Analytics'), {
  ssr: false,
});

export default function AnalyticsPage() {
  const [userMetrics, setUserMetrics] = useState({
    timeSpent: 0,
    hintReliance: 0,
    questionsAttempted: 0,
    codeStyle: 80,
    technicalExpertise: 40,
  });

  useEffect(() => {
    async function fetchMetrics() {
      const logs = (await getDocument(localStorage.getItem('userId'))).logs;
      const hintReliance = logs.filter(log => log.includes('hint')).length;
      const questionsAttempted = logs.filter(log => log.includes('attempted')).length;
      const timeSpent = await Number(localStorage.getItem('timeSpent'));
      
      setUserMetrics({
        timeSpent: timeSpent,
        hintReliance,
        questionsAttempted,
        codeStyle: 80,
        technicalExpertise: 40,
      });

      // Clear user data after getting metrics
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userId');
    }

    fetchMetrics();
  }, []);

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
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <Analytics metrics={userMetrics} />
        </div>
      </div>
    </div>
  );
}