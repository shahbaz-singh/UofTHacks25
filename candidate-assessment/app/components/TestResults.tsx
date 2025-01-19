'use client'

export interface TestResult {
  passedTests: number;
  totalTests: number;
  failedTests: { name: string; error: string }[];
  coverage: number;
  creativity: number;
  feedback: string;
}

interface TestResultsProps {
  results: TestResult
}

export default function TestResults({ results }: TestResultsProps) {
  const getColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const MetricBar = ({ label, value, total }: { label: string, value: number, total: number }) => {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          <span>{value} / {total}</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getColor(percentage)} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  const PercentageBar = ({ label, percentage }: { label: string, percentage: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColor(percentage)} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <MetricBar 
        label="Tests Passed" 
        value={results.passedTests} 
        total={results.totalTests} 
      />
      <PercentageBar 
        label="Code Coverage" 
        percentage={results.coverage} 
      />
      <PercentageBar 
        label="Test Creativity" 
        percentage={results.creativity} 
      />
      {results.failedTests.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-sm font-semibold text-red-500">Failed Tests:</div>
          {results.failedTests.map((failure, index) => (
            <div key={index} className="text-sm text-red-400">
              • {failure.name}: {failure.error}
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 text-sm text-gray-400 italic border-t border-gray-700 pt-4">
        {results.feedback}
      </div>
    </div>
  )
} 