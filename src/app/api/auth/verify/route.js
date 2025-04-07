// app/api/auth/verify/route.js
import { NextResponse } from 'next/server'
import { verifyToken } from '../../../lib/auth'
import User from '../../../models/User'
import dbConnect from '../../../lib/db'

export async function GET(request) {
  await dbConnect();
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  try {
    // Fetch user from database
    const user = await User.findById(decoded.userId).select('firstName email')
    
    if (!user) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({
      valid: true,
      user: {
        firstName: user.firstName,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}