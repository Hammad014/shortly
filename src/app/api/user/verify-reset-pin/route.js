import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  const { email, resetPin } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'Invalid code' }, { status: 400 });

    if (user.resetPasswordPin !== resetPin || Date.now() > user.resetPasswordPinExpiry) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Code verified' });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}