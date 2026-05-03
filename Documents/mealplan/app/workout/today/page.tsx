'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { WorkoutLogger } from '@/components/pages/WorkoutLogger';

export default function WorkoutTodayPage() {
  return (
    <main className="flex flex-col h-screen bg-zinc-950 text-zinc-50">
      <div className="flex-1 overflow-y-auto pb-20">
        <WorkoutLogger />
      </div>
      <BottomNav />
    </main>
  );
}
