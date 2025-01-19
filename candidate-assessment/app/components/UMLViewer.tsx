'use client'

import { useState } from 'react'
import Image from 'next/image'

interface UMLViewerProps {
  imagePath: string;
}

export default function UMLViewer({ imagePath }: UMLViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div 
        className="cursor-pointer"
        onClick={() => setIsExpanded(true)}
      >
        <Image
          src={imagePath}
          alt="UML Diagram"
          width={300}
          height={300}
          className="rounded-lg"
        />
      </div>

      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsExpanded(false)}
        >
          <div className="relative">
            <Image
              src={imagePath}
              alt="UML Diagram Expanded"
              width={800}
              height={800}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
} 