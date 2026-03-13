import { NextRequest, NextResponse } from 'next/server';
import { exchangeQBCode } from '@/lib/quickbooks';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const realmId = searchParams.get('realmId');

  if (!code || !realmId) {
    return NextResponse.json({ error: 'Missing code or realmId' }, { status: 400 });
  }

  try {
    const token = await exchangeQBCode(code, realmId);
    const supabase = getSupabaseAdmin();

    // Store the token in app_config
    const { error } = await (supabase.from('app_config') as any).upsert({
      key: 'quickbooks_token',
      value: token,
      updated_at: new Date().toISOString(),
    });

    if (error) throw error;

    // Redirect to Admin Inventory page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin?tab=inventory&success=true`);
  } catch (error: any) {
    console.error('QB Callback Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/admin?tab=inventory&error=${encodeURIComponent(error.message)}`);
  }
}
