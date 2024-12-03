// middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  
  const token = request.cookies.get('accessToken');
  
console.log(token)
  
  if (!token) {
    console.log("running")
    return NextResponse.redirect(new URL('/login', request.url));
  }

 
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'], 
};



