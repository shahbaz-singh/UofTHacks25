'use client'

export default function LoadingIndicator() {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-800/90 backdrop-blur rounded-lg p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10">
          {/* Outer circle */}
          <div className="absolute inset-0 border-3 border-gray-700 rounded-full" />
          
          {/* Spinning arc */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 border-3 border-[#FFA116] rounded-full animate-spin" 
                 style={{ 
                   clipPath: 'polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%)',
                   borderRightColor: 'transparent',
                   borderBottomColor: 'transparent' 
                 }} 
            />
          </div>

          {/* Inner circle */}
          <div className="absolute inset-[6px] border-2 border-gray-700 rounded-full bg-gray-800" />
          
          {/* Center dot */}
          <div className="absolute inset-[16px] bg-[#FFA116] rounded-full animate-pulse" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">AI Processing</div>
          <div className="text-xs text-gray-400">Analyzing documentation...</div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-gray-700 rounded-full overflow-hidden w-full">
        <div 
          className="h-full bg-[#FFA116] rounded-full animate-progress origin-left"
          style={{ animationDuration: '3s' }}
        />
      </div>
    </div>
  )
} 