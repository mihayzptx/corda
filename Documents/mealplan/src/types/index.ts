// Core entity types with timestamps
export interface BaseEntity {
  id: string;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

// User profile
export interface User extends BaseEntity {
  name: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  gender: 'male' | 'female' | 'other';
  trainingLevel: 'beginner' | 'intermediate' | 'advanced';
  startDate: number; // timestamp
  currentPhaseId: string;
  goals: Goal[];
  injuryFlags: InjuryFlag[];
  units: 'metric' | 'imperial';
  macroTargets: MacroTargets;
}

export interface Goal {
  type: 'fatLoss' | 'muscleGain' | 'maintenance' | 'strength';
  priority: number; // 1 = highest
  bodyParts?: string[]; // e.g., ['abdomen', 'chest', 'arms']
}

export interface InjuryFlag {
  name: string; // e.g., 'knee', 'lower back'
  constraint: string; // e.g., 'no deep knee flexion under load'
  severity: 'mild' | 'moderate' | 'severe';
}

export interface MacroTargets {
  trainingDay: { kcal: number; protein: number; carbs: number; fat: number };
  restDay: { kcal: number; protein: number; carbs: number; fat: number };
}

// Phase (training cycle)
export interface Phase extends BaseEntity {
  name: string;
  weekStart: number;
  weekEnd: number;
  rpeTarget: number; // 1-10
  progressionRule: string; // e.g., '+2.5kg isolation, +5kg compound'
  volumeTarget: number; // target sets per week
  notes: string;
}

// Exercise
export interface Exercise extends BaseEntity {
  name: string;
  muscleGroups: string[];
  secondaryMuscles?: string[];
  equipment: string[];
  kneLoadLevel: 'low' | 'medium' | 'high';
  backLoadLevel: 'low' | 'medium' | 'high';
  injurySafe: boolean;
  movementPattern: 'push' | 'pull' | 'squat' | 'hinge' | 'carry' | 'core' | 'cardio';
  videoUrl?: string;
  instructions: string;
  isCustom: boolean;
  source: 'builtin' | 'custom';
}

// Workout template
export interface WorkoutTemplate extends BaseEntity {
  name: string;
  type: 'upperA' | 'upperB' | 'lower' | 'cardioCore' | 'custom';
  exerciseIds: string[];
  defaultSets: number;
  defaultReps: { min: number; max: number };
  defaultRPE: number;
  notes?: string;
}

// Logged set during a workout
export interface LoggedSet extends BaseEntity {
  exerciseId: string;
  weight: number; // kg
  reps: number;
  rpe: number; // 1-10
  notes?: string;
}

// Workout session
export interface WorkoutSession extends BaseEntity {
  templateId: string;
  date: number; // timestamp
  status: 'completed' | 'partial' | 'skipped';
  skipReason?: 'injury' | 'time' | 'fatigue' | 'illness' | 'other';
  sets: LoggedSet[];
  notes?: string;
  kneeDiscomfort: number; // 1-10
  backDiscomfort: number; // 1-10
  energyLevel: number; // 1-10
}

// Food item
export interface FoodItem extends BaseEntity {
  name: string;
  nameUk?: string;
  calories: number; // per 100g
  protein: number; // g per 100g
  carbs: number; // g per 100g
  fat: number; // g per 100g
  fiber?: number; // g per 100g
  barcode?: string;
  isCustom: boolean;
  source: 'builtin' | 'openfoodfacts' | 'usda' | 'custom';
  category?: string; // e.g., 'protein', 'vegetable', 'grain'
}

// Food entry in a meal
export interface FoodEntry {
  foodId: string;
  quantity: number; // grams or serving count
  unit: 'grams' | 'serving';
}

// Meal
export interface Meal extends BaseEntity {
  name: string;
  time: number; // timestamp (just time, same day)
  foodEntries: FoodEntry[];
  isCheatMeal: boolean;
  notes?: string;
}

// Daily food log
export interface DailyLog extends BaseEntity {
  date: number; // timestamp (start of day)
  dayType: 'training' | 'rest';
  meals: Meal[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  bodyWeight?: number; // kg
  energyLevel: number; // 1-10
  sleepQuality: number; // 1-10
  notes?: string;
}

// Weekly check-in
export interface WeeklyCheckin extends BaseEntity {
  weekNumber: number;
  date: number; // timestamp
  avgWeight: number; // kg
  waistCm?: number;
  energyAvg: number; // 1-10
  sleepAvg: number; // 1-10
  kneeAvg: number; // 1-10
  backAvg: number; // 1-10
  workoutAdherence: { completed: number; planned: number };
  nutritionAdherence: { hitsTarget: number; total: number };
  notes?: string;
  phaseRecommendation?: 'continue' | 'repeat' | 'adjust';
}

// Meal template for quick logging
export interface MealTemplate extends BaseEntity {
  name: string;
  foodEntries: FoodEntry[];
  totalKcal: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

// State snapshot for adaptive engine
export interface WeekSnapshot {
  weekNumber: number;
  date: number;
  avgWeight: number;
  totalVolume: number;
  workoutAdherence: number;
  nutritionAdherence: number;
  painEvents: PainEvent[];
}

export interface PainEvent {
  date: number;
  location: 'knee' | 'back';
  level: number; // 1-10
  sessionId: string;
}
