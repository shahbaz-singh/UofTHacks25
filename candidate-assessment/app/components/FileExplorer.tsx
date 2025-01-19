'use client'

import { useState } from 'react'
import { FolderOpen, File, Plus } from 'lucide-react'

interface FileExplorerProps {
  files: string[]
  currentFile: string
  setCurrentFile: (file: string) => void
  onAddFile?: (fileName: string) => void
  onDeleteFile?: (fileName: string) => void
}

export default function FileExplorer({ files, currentFile, setCurrentFile, onAddFile, onDeleteFile }: FileExplorerProps) {
  const [isAddingFile, setIsAddingFile] = useState(false)
  const [newFileName, setNewFileName] = useState('')

  const handleAddFile = () => {
    if (newFileName.trim()) {
      // Add .ts extension if none provided
      const fileName = newFileName.includes('.') ? newFileName : `${newFileName}.ts`
      onAddFile?.(fileName)
      setNewFileName('')
      setIsAddingFile(false)
    }
  }

  const handleDeleteFile = (fileName: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the file selection
    if (onDeleteFile) {
      onDeleteFile(fileName)
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FolderOpen size={20} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-200">Files</span>
        </div>
        {onAddFile && (
          <button
            onClick={() => setIsAddingFile(true)}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Plus size={20} className="text-gray-400" />
          </button>
        )}
      </div>

      {isAddingFile && (
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="filename.ts"
            className="flex-1 px-2 py-1 text-sm bg-gray-700 rounded-lg text-white focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddFile()
              if (e.key === 'Escape') setIsAddingFile(false)
            }}
          />
          <button
            onClick={handleAddFile}
            className="px-2 py-1 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            Add
          </button>
        </div>
      )}

      <div className="space-y-1">
        {files.map(file => (
          <div
            key={file}
            onClick={() => setCurrentFile(file)}
            className={`flex justify-between items-center px-2 py-1 rounded-lg text-left ${
              currentFile === file
                ? 'bg-gray-700 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <span className="text-sm">{file}</span>
            {onDeleteFile && (
              <button
                onClick={(e) => handleDeleteFile(file, e)}
                className="text-gray-400 hover:text-red-400 text-sm"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

