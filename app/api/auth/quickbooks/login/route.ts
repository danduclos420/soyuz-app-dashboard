import { NextRequest, NextResponse } from 'next/server';
import { getQBAuthUrl } from '@/lib/quickbooks';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const env = (searchParams.get('env') as 'sandbox' | 'production') || 'production';

  const host = req.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const currentOrigin = `${protocol}://${host}`;
  const redirectUri = `${currentOrigin}/api/auth/quickbooks/callback`;
  
  const authUrl = getQBAuthUrl(redirectUri, env);
  return NextResponse.redirect(authUrl);
}
