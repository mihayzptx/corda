'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { AdaptiveEngine } from '@/lib/adaptiveEngine';
import type { WorkoutSession, WorkoutTemplate, Exercise } from '@/types';

export function useWorkoutTemplates() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await db.workoutTemplates.toArray();
      setTemplates(data);
      setLoading(false);
    };
    load();
  }, []);

  return { templates, loading };
}

export function useWorkoutSessions(days: number = 30) {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const data = await db.workoutSessions.where('date').above(cutoff).toArray();
      setSessions(data.sort((a, b) => b.date - a.date));
      setLoading(false);
    };
    load();
  }, [days]);

  const saveSession = async (session: WorkoutSession) => {
    await db.workoutSessions.put(session);
    setSessions((prev) => [session, ...prev.filter((s) => s.id !== session.id)]);
  };

  return { sessions, loading, saveSession };
}

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await db.exercises.toArray();
      setExercises(data);
      setLoading(false);
    };
    load();
  }, []);

  const filterByMuscleGroup = (group: string) => {
    return exercises.filter((e) => e.muscleGroups.includes(group));
  };

  const filterInjurySafe = () => {
    return exercises.filter((e) => e.injurySafe);
  };

  return { exercises, loading, filterByMuscleGroup, filterInjurySafe };
}

export function useSuggestedWeight(exerciseId: string, isCompound: boolean) {
  const [suggestedWeight, setSuggestedWeight] = useState<number | null>(null);

  useEffect(() => {
    const calculate = async () => {
      const sessions = await db.workoutSessions
        .where('date')
        .above(Date.now() - 14 * 24 * 60 * 60 * 1000)
        .toArray();

      const lastSession = sessions
        .filter((s) => s.sets.some((set) => set.exerciseId === exerciseId))
        .sort((a, b) => b.date - a.date)[0];

      if (!lastSession) {
        setSuggestedWeight(null);
        return;
      }

      const lastSet = lastSession.sets.find((s) => s.exerciseId === exerciseId);
      if (!lastSet) {
        setSuggestedWeight(null);
        return;
      }

      const user = await db.user.toCollection().first();
      const targetRPE = user?.goals[0]?.type === 'strength' ? 8 : 6;

      const suggested = AdaptiveEngine.suggestWeight(lastSet.weight, lastSet.rpe, targetRPE, isCompound);
      setSuggestedWeight(suggested);
    };

    calculate();
  }, [exerciseId, isCompound]);

  return suggestedWeight;
}
