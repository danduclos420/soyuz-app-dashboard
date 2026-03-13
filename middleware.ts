import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Temporarily bypass all logic to identify the source of __dirname error
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
