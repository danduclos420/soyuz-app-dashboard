import { NextResponse } from 'next/server';
import { syncErplainProducts } from '@/lib/erplain';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    console.log('API: Starting inventory sync...');
    const result = await syncErplainProducts();
    if (result.success) {
      console.log('API: Sync completed successfully');
      return NextResponse.json({ message: 'Sync completed successfully' });
    } else {
      console.error('API: Sync failed with result:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API: Sync route exception:', error.message || error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
