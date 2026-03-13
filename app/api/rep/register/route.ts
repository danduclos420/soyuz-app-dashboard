import { NextRequest, NextResponse } from 'next/server';
import { resend, DEFAULT_FROM_EMAIL } from '@/lib/resend';
import { 
  getRepApplicationReceivedTemplate, 
  getAdminNewRepAlertTemplate 
} from '@/lib/email-templates';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // 1. Send confirmation to the applicant
    await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [data.email],
      subject: 'Candidature SOYUZ BC : Transmission Reçue',
      html: getRepApplicationReceivedTemplate(data),
    });

    // 2. Send alert to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@soyuzhockey.com';
    await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [adminEmail],
      subject: `ALERTE : Nouvelle candidature Rep - ${data.firstName} ${data.lastName}`,
      html: getAdminNewRepAlertTemplate(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email registration error:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
