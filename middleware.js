//middleware.js

import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('token')?.value
  const protectedPaths = ['/dashboard']

  if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// Add token verification
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  request.user = decoded; // Add user to request object
} catch (error) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  response.cookies.delete('token');
  return response;
}
  }

  return NextResponse.next()
}