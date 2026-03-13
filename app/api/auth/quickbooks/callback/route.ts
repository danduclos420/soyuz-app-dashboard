import { NextRequest, NextResponse } from 'next/server';
import { exchangeQBCode } from '@/lib/quickbooks';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const realmId = searchParams.get('realmId');

  if (!code || !realmId) {
    return NextResponse.json({ error: 'Missing code or realmId' }, { status: 400 });
  }

  try {
    const token = await exchangeQBCode(code, realmId);
    const supabase = getSupabaseAdmin();

    // Store token in Supabase
    const { error } = await (supabase
      .from('app_config') as any)
      .upsert({
        key: 'quickbooks_token',
        value: token,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' });

    if (error) throw error;

    // Redirect back to admin dashboard with success message
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin?qb_sync=success`);
  } catch (error: any) {
    console.error('QuickBooks Callback Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin?qb_sync=error&message=${encodeURIComponent(error.message)}`);
  }
}
