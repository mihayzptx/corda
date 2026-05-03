import Dexie, { Table } from 'dexie';
import type {
  User,
  Phase,
  Exercise,
  WorkoutTemplate,
  WorkoutSession,
  FoodItem,
  DailyLog,
  WeeklyCheckin,
  MealTemplate,
} from '@/types';

export class MealPlanDB extends Dexie {
  user!: Table<User>;
  phases!: Table<Phase>;
  exercises!: Table<Exercise>;
  workoutTemplates!: Table<WorkoutTemplate>;
  workoutSessions!: Table<WorkoutSession>;
  foodItems!: Table<FoodItem>;
  dailyLogs!: Table<DailyLog>;
  weeklyCheckins!: Table<WeeklyCheckin>;
  mealTemplates!: Table<MealTemplate>;

  constructor() {
    super('mealplan');
    this.version(1).stores({
      user: 'id',
      phases: 'id',
      exercises: 'id, &name, source',
      workoutTemplates: 'id, type',
      workoutSessions: 'id, date, templateId',
      foodItems: 'id, &name, source, category',
      dailyLogs: 'id, date',
      weeklyCheckins: 'id, weekNumber, date',
      mealTemplates: 'id, &name',
    });
  }
}

export const db = new MealPlanDB();

// Initialization: create default user and seed data if needed
export async function initializeDatabase() {
  const existingUser = await db.user.toCollection().first();

  if (!existingUser) {
    // First launch: create default user and seed data
    const defaultUser: User = {
      id: 'user-default',
      name: 'You',
      age: 36,
      height: 192,
      weight: 95,
      gender: 'male',
      trainingLevel: 'intermediate',
      startDate: Date.now(),
      currentPhaseId: '',
      goals: [
        { type: 'fatLoss', priority: 1, bodyParts: ['abdomen'] },
        { type: 'muscleGain', priority: 2, bodyParts: ['chest', 'arms'] },
      ],
      injuryFlags: [
        {
          name: 'Knee post-surgery',
          constraint: 'no deep knee flexion under load, no explosive movements',
          severity: 'moderate',
        },
        {
          name: 'Chronic lower back pain',
          constraint: 'no heavy axial loading, core stabilization focus',
          severity: 'moderate',
        },
      ],
      units: 'metric',
      macroTargets: {
        trainingDay: { kcal: 2400, protein: 160, carbs: 280, fat: 80 },
        restDay: { kcal: 2100, protein: 160, carbs: 180, fat: 70 },
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Create phases
    const now = Date.now();
    const adaptationPhase: Phase = {
      id: 'phase-1-adaptation',
      name: 'Adaptation (Weeks 1-3)',
      weekStart: 1,
      weekEnd: 3,
      rpeTarget: 6,
      progressionRule: 'Focus on form and recovery',
      volumeTarget: 40,
      notes: 'Rebuild work capacity after detraining',
      createdAt: now,
      updatedAt: now,
    };

    const volumePhase: Phase = {
      id: 'phase-2-volume',
      name: 'Volume (Weeks 4-6)',
      weekStart: 4,
      weekEnd: 6,
      rpeTarget: 7,
      progressionRule: '+2.5kg isolation, +5kg compound when RPE < target',
      volumeTarget: 50,
      notes: 'Increase training volume and density',
      createdAt: now,
      updatedAt: now,
    };

    const intensityPhase: Phase = {
      id: 'phase-3-intensity',
      name: 'Intensity (Weeks 7-10)',
      weekStart: 7,
      weekEnd: 10,
      rpeTarget: 8,
      progressionRule: '+5kg isolation, +7.5kg compound when RPE < target',
      volumeTarget: 45,
      notes: 'Higher intensity, lower volume, strength focus',
      createdAt: now,
      updatedAt: now,
    };

    defaultUser.currentPhaseId = adaptationPhase.id;

    await db.user.add(defaultUser);
    await db.phases.bulkAdd([adaptationPhase, volumePhase, intensityPhase]);

    // Seed exercises and foods will be called separately
    console.log('Database initialized with default user and phases');
  }
}
