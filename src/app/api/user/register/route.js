import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD
  }
});

const emailTemplate = (firstName, verifyLink) => `
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .button { 
      display: inline-block; 
      background: #2563eb; 
      color: white !important; 
      padding: 12px 25px; 
      border-radius: 5px; 
      text-decoration: none; 
      margin: 20px 0; 
    }
    .footer { text-align: center; margin-top: 30px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Welcome to Our Service, ${firstName}! 👋</h2>
    </div>
    <p>Please verify your email address to complete registration:</p>
    <a href="${verifyLink}" class="button">Verify Email</a>
    <p>Or copy this link to your browser:<br>${verifyLink}</p>
    <div class="footer">
      <p>Best Regards,<br>Our Team</p>
    </div>
  </div>
</body>
</html>
`;

export async function POST(req) {
  await dbConnect();
  const { firstName, email, password } = await req.json();

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ error: 'Email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = randomBytes(32).toString('hex');
    
    const newUser = new User({
      firstName,
      email,
      password: hashedPassword,
      verificationToken
    });

    await newUser.save();

    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/verify?token=${verificationToken}&email=${email}`;
    
    await transporter.sendMail({
      from: `"Our Service" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email',
      html: emailTemplate(firstName, verifyLink)
    });

    return Response.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}