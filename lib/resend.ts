import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

// Lazy initialization to avoid build-time errors if the API key is missing
let _resend: Resend | null = null;

export const getResend = () => {
  if (_resend) return _resend;
  
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY is not defined. Email functionality will be limited.');
    // We still return an instance with a dummy key to avoid crashes, 
    // but operations will fail gracefully or be caught.
    _resend = new Resend('missing_api_key');
  } else {
    _resend = new Resend(resendApiKey);
  }
  return _resend;
};

// Use a Proxy to maintain the same import syntax: import { resend } from '@/lib/resend'
export const resend = new Proxy({} as Resend, {
  get(target, prop, receiver) {
    const client = getResend();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === 'function' ? value.bind(client) : value;
  }
});

export const DEFAULT_FROM_EMAIL = 'SOYUZ BC <orders@soyuzhockey.com>';
