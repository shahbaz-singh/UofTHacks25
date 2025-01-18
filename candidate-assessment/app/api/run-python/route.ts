import { NextResponse } from 'next/server'
import { PythonShell } from 'python-shell'

export async function POST(req: Request) {
  const { code } = await req.json()

  try {
    const result = await new Promise<string[]>((resolve, reject) => {
      PythonShell.runString(code, null, (err, output) => {
        if (err) reject(err)
        else resolve(output)
      })
    })

    return NextResponse.json({ output: result.join('\n') })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}