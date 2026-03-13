import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.warn('RESEND_API_KEY is not defined. Email functionality will be disabled.');
}

export const resend = new Resend(resendApiKey);

export const DEFAULT_FROM_EMAIL = 'SOYUZ BC <orders@soyuzhockey.com>';
// Note: If using Resend sandbox, you can only send to your own authenticated email.
