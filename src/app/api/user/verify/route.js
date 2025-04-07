import dbConnect from '../../../lib/db';
import User from '../../../models/User';

const successPage = `
<!DOCTYPE html>
<html>
<head>
  <title>Email Verified</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      display: flex; 
      justify-content: center; 
      align-items: center; 
      height: 100vh; 
      margin: 0; 
      background: #f0f4f8; 
    }
    .card {
      background: white; 
      padding: 2rem; 
      border-radius: 10px; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
      text-align: center;
    }
    .success { color: #10b981; font-size: 4rem; }
    .button {
      background: #2563eb; 
      color: white; 
      padding: 0.75rem 1.5rem; 
      border-radius: 5px; 
      text-decoration: none; 
      display: inline-block; 
      margin-top: 1rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="success">✓</div>
    <h1>Email Verified!</h1>
    <p>Your account has been successfully verified</p>
    <a href="/login" class="button">Continue to Login</a>
  </div>
</body>
</html>
`;

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  try {
    const user = await User.findOne({ email });
    if (!user) return new Response('User not found', { status: 404 });
    if (user.verificationToken !== token) return new Response('Invalid token', { status: 400 });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return new Response(successPage, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Verification error:', error);
    return new Response('Server error', { status: 500 });
  }
}