'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Analytics with no SSR
const Analytics = dynamic(() => import('./Analytics'), {
  ssr: false,
});

export default function AnalyticsPage() {
  const [userMetrics, setUserMetrics] = useState({
    timeSpent: Math.floor(Math.random() * 51) + 50,
    hintReliance: Math.floor(Math.random() * 51) + 50,
    questionsAttempted: Math.floor(Math.random() * 51) + 50,
    codeStyle: Math.floor(Math.random() * 51) + 50,
    technicalExpertise: Math.floor(Math.random() * 51) + 50,
  });

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