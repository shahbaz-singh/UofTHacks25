import { FolderIcon, FileIcon } from 'lucide-react'

interface FileExplorerProps {
  files: string[]
  currentFile: string
  setCurrentFile: (file: string) => void
}

export default function FileExplorer({ files, currentFile, setCurrentFile }: FileExplorerProps) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        <FolderIcon className="mr-2" size={20} />
        Files
      </h2>
      <ul>
        {files.map((file) => (
          <li
            key={file}
            className={`cursor-pointer py-1 px-2 rounded ${
              file === currentFile ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
            onClick={() => setCurrentFile(file)}
          >
            <FileIcon className="inline-block mr-2" size={16} />
            {file}
          </li>
        ))}
      </ul>
    </div>
  )
}

