import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const adminEmail = 'admin@soyuzbc.com';
  const adminPassword = 'adminprotos';

  try {
    // Check if user exists
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listError) throw listError;

    const existingUser = users.find(u => u.email === adminEmail);
    let userId: string | undefined = existingUser?.id;

    if (!existingUser) {
      // Create user
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      });

      if (createError) throw createError;
      userId = createData.user.id;
    }

    if (!userId) throw new Error('Failed to obtain User ID');

    // Create profile if not exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: adminEmail,
          role: 'admin',
          status: 'approved',
          full_name: 'Admin Protos'
        } as any);

      if (profileError) throw profileError;
    }

    return NextResponse.json({ message: 'Admin user initialized successfully' });
  } catch (error: any) {
    console.error('Error initializing admin:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
