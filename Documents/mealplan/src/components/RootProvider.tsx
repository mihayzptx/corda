'use client';

import { useEffect, ReactNode } from 'react';
import { initializeDatabase } from '@/lib/db';
import { seedDatabase } from '@/lib/seedDatabase';

export function RootProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        await seedDatabase();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    init();
  }, []);

  return <>{children}</>;
}
