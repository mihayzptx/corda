'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import type { DailyLog, FoodItem, MealTemplate } from '@/types';

export function useDailyLog(date?: number) {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  const targetDate = date || Math.floor(Date.now() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);

  useEffect(() => {
    const load = async () => {
      const existing = await db.dailyLogs.get(targetDate);
      setLog(existing || null);
      setLoading(false);
    };
    load();
  }, [targetDate]);

  const saveLog = async (newLog: DailyLog) => {
    await db.dailyLogs.put(newLog);
    setLog(newLog);
  };

  return { log, loading, saveLog };
}

export function useFoods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await db.foodItems.toArray();
      setFoods(data);
      setLoading(false);
    };
    load();
  }, []);

  const search = (query: string) => {
    return foods.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));
  };

  const filterByCategory = (category: string) => {
    return foods.filter((f) => f.category === category);
  };

  return { foods, loading, search, filterByCategory };
}

export function useMealTemplates() {
  const [templates, setTemplates] = useState<MealTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await db.mealTemplates.toArray();
      setTemplates(data);
      setLoading(false);
    };
    load();
  }, []);

  const createTemplate = async (template: MealTemplate) => {
    await db.mealTemplates.add(template);
    setTemplates((prev) => [...prev, template]);
  };

  return { templates, loading, createTemplate };
}

export function useDailyLogs(days: number = 30) {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      const data = await db.dailyLogs.where('date').above(cutoff).toArray();
      setLogs(data.sort((a, b) => b.date - a.date));
      setLoading(false);
    };
    load();
  }, [days]);

  return { logs, loading };
}
