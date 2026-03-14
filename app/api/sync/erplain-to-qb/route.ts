import { NextResponse } from 'next/server';
import { pushErplainProductsToQB } from '@/lib/erplain-to-qb';

export async function POST() {
  try {
    const result = await pushErplainProductsToQB();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Erplain to QB Sync failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || String(error) 
    }, { status: 500 });
  }
}
