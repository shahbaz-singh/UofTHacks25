'use client'

interface MetricProps {
  label: string
  percentage: number
}

function Metric({ label, percentage }: MetricProps) {
  const getColor = (value: number) => {
    if (value >= 80) return 'bg-green-500'
    if (value >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{percentage}%</span>
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

interface DocumentationMetricsProps {
  feedback: string
}

export default function DocumentationMetrics({ feedback }: DocumentationMetricsProps) {
  const parseMetrics = (text: string) => {
    const lines = text.split('\n')
    const status = lines[0].split(': ')[1]
    const metrics = lines.slice(1, 5).map(line => {
      const [label, value] = line.split(': ')
      return {
        label,
        percentage: parseInt(value)
      }
    })
    const feedbackText = lines[5].split(': ')[1]
    return { status, metrics, feedbackText }
  }

  const { status, metrics, feedbackText } = parseMetrics(feedback)

  return (
    <div className="space-y-4">
      <div className={`text-center p-2 rounded-lg font-semibold ${
        status === 'PASS' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
      }`}>
        {status}
      </div>
      <div className="space-y-3">
        {metrics.map(metric => (
          <Metric 
            key={metric.label}
            label={metric.label}
            percentage={metric.percentage}
          />
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-400 italic border-t border-gray-700 pt-4">
        {feedbackText}
      </div>
    </div>
  )
} 