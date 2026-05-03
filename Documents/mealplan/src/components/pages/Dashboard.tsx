'use client';

import { useUser } from '@/hooks/useUser';
import { useDailyLog } from '@/hooks/useNutrition';
import { useWorkoutSessions } from '@/hooks/useWorkout';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const { log: todayLog } = useDailyLog();
  const { sessions: workoutSessions } = useWorkoutSessions(7);
  const [weekAvgWeight, setWeekAvgWeight] = useState<number | null>(null);

  useEffect(() => {
    if (workoutSessions.length > 0) {
      const weights = workoutSessions
        .map((s) => {
          // In a real app, we'd calculate avg weight from daily logs
          // For now just show session date
          return s.date;
        });
    }
  }, [workoutSessions]);

  if (userLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return <div className="p-4">No user found</div>;
  }

  const dayTarget = todayLog?.dayType === 'training' ? user.macroTargets.trainingDay : user.macroTargets.restDay;
  const todayProtein = todayLog?.totalProtein || 0;
  const todayKcal = todayLog?.totalKcal || 0;
  const proteinProgress = (todayProtein / dayTarget.protein) * 100;
  const kcalProgress = (todayKcal / dayTarget.kcal) * 100;

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="pt-4">
        <h1 className="text-2xl font-bold text-orange-500">Body Recomposition</h1>
        <p className="text-zinc-400 text-sm mt-1">Week 1 of Adaptation Phase</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider">Current Weight</p>
          <p className="text-2xl font-bold mt-2">{user.weight} kg</p>
          <p className="text-zinc-500 text-xs mt-2">↓ 0.4 kg this week</p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider">Waist</p>
          <p className="text-2xl font-bold mt-2">—</p>
          <p className="text-zinc-500 text-xs mt-2">Log in check-in</p>
        </div>
      </div>

      {/* Today's Nutrition */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Today's Nutrition</h2>
          <Link href="/nutrition/today" className="text-orange-500 text-sm hover:text-orange-400">
            Edit
          </Link>
        </div>

        {/* Calorie Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-400">Calories</span>
            <span className="text-sm font-medium">{todayKcal} / {dayTarget.kcal}</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(kcalProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Protein Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-zinc-400">Protein</span>
            <span className="text-sm font-medium">{todayProtein} / {dayTarget.protein}g</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${proteinProgress >= 100 ? 'bg-green-500' : 'bg-orange-500'}`}
              style={{ width: `${Math.min(proteinProgress, 100)}%` }}
            />
          </div>
        </div>

        {/* Day Type Toggle */}
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-400 mb-2">Day Type: {todayLog?.dayType === 'training' ? 'Training' : 'Rest'}</p>
          <Link
            href="/nutrition/today"
            className="text-xs text-orange-500 hover:text-orange-400"
          >
            Toggle day type
          </Link>
        </div>
      </div>

      {/* Today's Workout */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Today's Workout</h2>
          <Link href="/workout/today" className="text-orange-500 text-sm hover:text-orange-400">
            Log
          </Link>
        </div>
        <p className="text-zinc-400 text-sm mb-4">No workout logged yet today</p>
        <Link
          href="/workout/today"
          className="w-full bg-orange-500 text-black py-2 rounded-lg font-medium text-center hover:bg-orange-600 transition-colors"
        >
          Start Workout
        </Link>
      </div>

      {/* Weekly Snapshot */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
        <h2 className="font-semibold mb-4">This Week</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Workouts Completed</span>
            <span className="font-medium">{workoutSessions.length} / 3</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Avg Knee Comfort</span>
            <span className="font-medium">8/10</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Avg Back Comfort</span>
            <span className="font-medium">7/10</span>
          </div>
          <div className="pt-3 border-t border-zinc-800">
            <Link
              href="/check-in"
              className="text-orange-500 text-sm hover:text-orange-400 font-medium"
            >
              Complete weekly check-in →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      {workoutSessions.length > 0 && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <h2 className="font-semibold mb-4">Recent Sessions</h2>
          <div className="space-y-2">
            {workoutSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex justify-between text-sm py-2 border-b border-zinc-800">
                <span className="text-zinc-400">{new Date(session.date).toLocaleDateString()}</span>
                <span className="text-zinc-300">{session.sets.length} sets</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/workout/exercises"
          className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg text-center text-sm transition-colors"
        >
          🏋️ Exercise Library
        </Link>
        <Link
          href="/progress"
          className="bg-zinc-800 hover:bg-zinc-700 p-3 rounded-lg text-center text-sm transition-colors"
        >
          📊 View Charts
        </Link>
      </div>
    </div>
  );
}
