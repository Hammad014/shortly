import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

const resetEmailTemplate = (firstName, pin) => `
<html>
<head>
  <style>
    body { 
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      padding: 20px; 
    }
    .header { 
      text-align: center; 
      border-bottom: 2px solid #144ee3; 
      padding-bottom: 20px; 
    }
    .logo { 
      max-width: 150px; 
    }
    .content { 
      padding: 30px 20px; 
    }
    .code { 
      font-size: 1.5em; 
      letter-spacing: 3px; 
      background: #f5f5f5; 
      padding: 10px 20px; 
      border-radius: 5px; 
      margin: 20px 0; 
      display: inline-block;
    }
    .footer { 
      text-align: center; 
      margin-top: 30px; 
      color: #666; 
      font-size: 0.9em; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://i.ibb.co/0jQ3Z7X/linkly-logo.png" class="logo" alt="Linkly Logo">
    </div>
    <div class="content">
      <h2>Password Reset Request 🔒</h2>
      <p>Hello ${firstName},</p>
      <p>We received a request to reset your Linkly account password. Use this 6-digit verification code:</p>
      <div class="code">${pin}</div>
      <p>This code will expire in 1 hour.</p>
      <p>If you didn't request this, please secure your account immediately.</p>
    </div>
    <div class="footer">
      <p>Best Regards,<br>The Linkly Security Team</p>
    </div>
  </div>
</body>
</html>
`;

export async function POST(req) {
  await dbConnect();
  const { email } = await req.json();

  try {
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 3600000; // 1 hour

    user.resetPasswordPin = pin;
    user.resetPasswordPinExpiry = expiry;
    await user.save();

    await transporter.sendMail({
      from: `"My App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code',
      html: resetEmailTemplate(user.firstName, pin)
    });

    return NextResponse.json({ message: 'Reset code sent to email' });

  } catch (error) {
    console.error('Reset request error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}