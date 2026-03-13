import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 });
    }

    // Check if affiliate code exists and is approved
    const { data: affiliate, error } = await supabase
      .from('affiliates')
      .select('*, profiles(full_name)')
      .eq('affiliate_code', code.toUpperCase())
      .eq('status', 'approved')
      .single();

    if (error || !affiliate) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Invalid or inactive affiliate code' 
      });
    }

    return NextResponse.json({ 
      valid: true, 
      affiliateName: (affiliate as any).profiles?.full_name || 'Soyuz Partner',
      discount: 0 // In this business model, codes track sales but don't always give discounts to clients
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ valid: false, error: 'Internal server error' }, { status: 500 });
  }
}
