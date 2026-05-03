'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { ProgressPage } from '@/components/pages/Progress';

export default function Page() {
  return (
    <main className="flex flex-col h-screen bg-zinc-950 text-zinc-50">
      <div className="flex-1 overflow-y-auto pb-20">
        <ProgressPage />
      </div>
      <BottomNav />
    </main>
  );
}
