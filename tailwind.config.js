module.exports = {
  // ... other config
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-reverse': 'spin 1s linear infinite reverse',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress': 'progress 3s ease-in-out infinite',
      },
      borderWidth: {
        '3': '3px',
      },
      keyframes: {
        progress: {
          '0%': { transform: 'scaleX(0)' },
          '50%': { transform: 'scaleX(0.7)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
} 