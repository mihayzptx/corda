'use client';

import { BottomNav } from '@/components/layout/BottomNav';
import { NutritionLogger } from '@/components/pages/NutritionLogger';

export default function NutritionTodayPage() {
  return (
    <main className="flex flex-col h-screen bg-zinc-950 text-zinc-50">
      <div className="flex-1 overflow-y-auto pb-20">
        <NutritionLogger />
      </div>
      <BottomNav />
    </main>
  );
}
