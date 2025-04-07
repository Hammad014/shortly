// app/api/user/login/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await dbConnect();
  const { email, password } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (!user.isVerified) {
      return NextResponse.json({ error: 'Account not verified' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        firstName: user.firstName, 
        email: user.email 
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    const response = NextResponse.json({
      message: 'Login successful',
      user: { firstName: user.firstName, email: user.email }
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production', // Handle Vercel deployments
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax', // Strict only in production
      maxAge: 172800,
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : undefined // Domain only in production
    });
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}