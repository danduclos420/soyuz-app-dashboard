import { NextResponse } from 'next/server';
import { getQBAuthUrl } from '@/lib/quickbooks';

export async function GET() {
  const authUrl = getQBAuthUrl();
  return NextResponse.redirect(authUrl);
}
