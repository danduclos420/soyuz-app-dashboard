'use client';

import { useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useDevStore } from '@/lib/store/dev';

interface DevToolGateProps {
  children: ReactNode;
}

export default function DevToolGate({ children }: DevToolGateProps) {
  const { isDevMode, setDevMode } = useDevStore();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAccess() {
      // 1. Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no session but isDevMode is on (local storage), we allow it 
        // to support the isolated "devtool/devtool" shortcut if the user 
        // hasn't signed in to a real account yet.
        setIsAuthorized(isDevMode);
        return;
      }

      // 2. If signed in, verify role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'devtool') {
        setIsAuthorized(true);
      } else {
        // CRITICAL: Force disable dev mode if logged in as anyone else (like adminprotos)
        if (isDevMode) {
          setDevMode(false);
        }
        setIsAuthorized(false);
      }
    }

    checkAccess();
  }, [isDevMode, setDevMode]);

  // Don't render anything until we've checked authorization
  if (isAuthorized === null) return null;
  if (!isAuthorized) return null;

  return <>{children}</>;
}
