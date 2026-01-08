import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Forward to backend API
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/website/reviews`)

    if (!backendResponse.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch reviews' },
        { status: backendResponse.status }
      )
    }

    const data = await backendResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error in website reviews API:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
