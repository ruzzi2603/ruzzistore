'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    api
      .get('/auth/me')
      .then(() => router.push('/'))
      .catch(() => router.push('/login'));
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-lg animate-pulse">
        Finalizando login com Google...
      </p>
    </div>
  );
}
