import { NextResponse } from 'next/server';
import { getQBAuthUrl } from '@/lib/quickbooks';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const supabase = getSupabaseAdmin();
  
  // Verify if requester is admin (could check session here if needed)
  // For simplicity, we just provide the URL for a manual redirect from admin panel
  const authUrl = getQBAuthUrl();
  return NextResponse.redirect(authUrl);
}
