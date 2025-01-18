'use client';

import dynamic from 'next/dynamic';

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
          <Analytics metrics={sampleMetrics} />
        </div>
      </div>
    </div>
  );
}
