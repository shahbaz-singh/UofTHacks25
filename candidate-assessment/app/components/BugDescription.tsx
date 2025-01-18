import { AlertCircle } from 'lucide-react'

export interface BugDescriptionProps {
  description: string
}

export default function BugDescription({ description }: BugDescriptionProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        <AlertCircle className="mr-2" size={20} />
        Bug Description
      </h2>
      <p>{description}</p>
    </div>
  )
}

