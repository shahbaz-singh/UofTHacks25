interface CodeOutputProps {
    output: string
  }
  
export default function CodeOutput({ output }: CodeOutputProps) {
    return (
      <div className="mt-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Output</h2>
        <pre className="bg-black p-2 rounded whitespace-pre-wrap">{output || 'No output yet. Run your code to see the result.'}</pre>
      </div>
    )
}  