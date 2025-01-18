import { NextResponse } from 'next/server'
import { spawn } from 'child_process'

const getPythonCommand = () => {
  // Try different possible Python commands
  const commands = ['python3', 'python', 'py']
  
  for (const cmd of commands) {
    try {
      const test = spawn(cmd, ['--version'])
      return cmd
    } catch (error) {
      continue
    }
  }
  throw new Error('Python is not installed or not found in PATH')
}

export async function POST(request: Request) {
  try {
    const { code } = await request.json()
    console.log('Received code:', code)
    const pythonCommand = await getPythonCommand()

    const pythonCode = `
${code}  # Include the complete function definition

# Test cases
test_cases = [
    # Basic cases
    (2, 3, 5),
    (0, 0, 0),
    (-1, 1, 0),
    (10, -5, 5),
    
    # Large numbers
    (1000, 2000, 3000),
    (-5000, 5000, 0),
    
    # More negative numbers
    (-10, -20, -30),
    (-7, -3, -10),
    
    # Zero cases
    (0, 42, 42),
    (42, 0, 42)
]

# Test the function
for a, b, expected in test_cases:
    result = add(a, b)
    if result is None:
        print(f"Error: Function returned None instead of a number")
        exit(1)
    if result != expected:
        print(f"Test failed: add({a}, {b}) returned {result}, expected {expected}")
        exit(1)

print("All tests passed!")
`

    // Execute the Python code
    const python = spawn(pythonCommand, ['-c', pythonCode])
    
    let output = ''
    let error = ''

    const result = await new Promise((resolve, reject) => {
      python.stdout.on('data', (data) => {
        output += data.toString()
      })

      python.stderr.on('data', (data) => {
        error += data.toString()
      })

      python.on('error', (err) => {
        reject(new Error('Failed to execute Python. Please ensure Python is installed properly.'))
      })

      python.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, message: output })
        } else {
          if (error.includes('SyntaxError') || error.includes('IndentationError')) {
            reject(new Error('Python syntax error: Please check your code formatting'))
          } else if (output.includes('Error: Function returned None')) {
            reject(new Error('Your function is not returning a value. Make sure to use a return statement.'))
          } else if (output.includes('Test failed')) {
            reject(new Error(output.trim()))
          } else {
            reject(new Error(error || output || 'Test cases failed'))
          }
        }
      })
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Great job! Your solution passed all tests.' 
    })

  } catch (error) {
    console.error('Python execution error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred while testing your solution.' 
    }, { status: 400 })
  }
} 