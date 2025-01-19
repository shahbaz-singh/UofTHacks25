import { AlertCircle } from 'lucide-react'

interface BugDescriptionProps {
  description: string;
  isUMLChallenge?: boolean;
}

export default function BugDescription({ description, isUMLChallenge }: BugDescriptionProps) {
  return (
    <div className="mt-4 bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">
        {isUMLChallenge ? 'Diagram Description' : 'Bug Description'}
      </h2>
      <p className="whitespace-pre-line">{description}</p>
    </div>
  );
}

