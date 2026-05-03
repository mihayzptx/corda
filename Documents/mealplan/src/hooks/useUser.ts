'use client';

import { useEffect, useState } from 'react';
import { db, initializeDatabase } from '@/lib/db';
import type { User } from '@/types';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        await initializeDatabase();
        const userData = await db.user.toCollection().first();
        setUser(userData || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    const updated = {
      ...user,
      ...updates,
      updatedAt: Date.now(),
    };

    try {
      await db.user.update(user.id, updated);
      setUser(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    }
  };

  return { user, loading, error, updateUser };
}
