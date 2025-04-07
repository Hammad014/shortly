import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await dbConnect();
  const { email, resetPin, newPassword } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user || user.resetPasswordPin !== resetPin) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordPin = undefined;
    user.resetPasswordPinExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully' });

  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}