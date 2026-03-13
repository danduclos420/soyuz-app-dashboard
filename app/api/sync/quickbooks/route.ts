import { NextRequest, NextResponse } from 'next/server';
import { syncQuickBooksInventory } from '@/lib/quickbooks';

export async function GET(req: NextRequest) {
  // Simple auth check for cron or manual triggers
  const authHeader = req.headers.get('authorization');
  const internalSecret = process.env.CRON_SECRET;

  // If CRON_SECRET is set, require it
  if (internalSecret && authHeader !== `Bearer ${internalSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await syncQuickBooksInventory();
  
  if (result.success) {
    return NextResponse.json({ 
      success: true, 
      message: `Successfully synced ${result.count} items from QuickBooks.`,
      timestamp: new Date().toISOString()
    });
  } else {
    const isAuthError = result.error?.includes('not connected') || result.error?.includes('authenticate');
    return NextResponse.json({ 
      success: false, 
      error: result.error 
    }, { status: isAuthError ? 400 : 500 });
  }
}

// POST is also allowed for manual triggers from admin
export async function POST() {
  const result = await syncQuickBooksInventory();
  return NextResponse.json(result);
}
