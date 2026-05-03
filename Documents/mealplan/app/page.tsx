'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { Dashboard } from '@/components/pages/Dashboard';

export default function Home() {
  return (
    <main className="flex flex-col h-screen bg-zinc-950 text-zinc-50">
      <div className="flex-1 overflow-y-auto pb-20">
        <Dashboard />
      </div>
      <BottomNav currentPath="/" />
    </main>
  );
}
