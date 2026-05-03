import { db } from './db';
import type { WorkoutSession, DailyLog, User, Phase } from '@/types';

export class AdaptiveEngine {
  /**
   * Suggests weight for next set based on last session RPE and progression rules
   */
  static suggestWeight(
    lastWeight: number,
    lastRPE: number,
    targetRPE: number,
    isCompound: boolean
  ): number {
    // If RPE was below target and all reps were hit, increase weight
    if (lastRPE < targetRPE) {
      const increase = isCompound ? 5 : 2.5;
      return Math.round((lastWeight + increase) * 2) / 2; // Round to nearest 0.5
    }

    // If RPE was above target, stay same or decrease
    if (lastRPE > targetRPE) {
      const decrease = isCompound ? 5 : 2.5;
      return Math.round((lastWeight - decrease) * 2) / 2;
    }

    // RPE matches target, stay same
    return lastWeight;
  }

  /**
   * Detect if user should deload based on pain levels
   * Returns true if 2 consecutive sessions have pain > 4/10
   */
  static async detectDeloadNeed(userId: string): Promise<boolean> {
    const sessions = await db.workoutSessions.where('date').above(Date.now() - 14 * 24 * 60 * 60 * 1000).toArray();

    if (sessions.length < 2) return false;

    const recentSessions = sessions.slice(-2).sort((a, b) => a.date - b.date);

    const kneeDeload = recentSessions.every((s) => s.kneeDiscomfort > 4);
    const backDeload = recentSessions.every((s) => s.backDiscomfort > 4);

    return kneeDeload || backDeload;
  }

  /**
   * Detect stall: if weight hasn't moved 0.3kg+ for 3 weeks
   */
  static async detectStall(exerciseId: string): Promise<boolean> {
    const threeWeeksAgo = Date.now() - 21 * 24 * 60 * 60 * 1000;
    const sessions = await db.workoutSessions
      .where('date')
      .above(threeWeeksAgo)
      .toArray();

    if (sessions.length === 0) return false;

    // Extract max weight for this exercise from each week
    const weekWeights: number[] = [];
    let currentWeek = 0;
    let weekMaxWeight = 0;

    for (const session of sessions.sort((a, b) => a.date - b.date)) {
      const set = session.sets.find((s) => s.exerciseId === exerciseId);
      if (set) {
        const weekNum = Math.floor((session.date - threeWeeksAgo) / (7 * 24 * 60 * 60 * 1000));
        if (weekNum > currentWeek) {
          weekWeights.push(weekMaxWeight);
          currentWeek = weekNum;
          weekMaxWeight = set.weight;
        } else {
          weekMaxWeight = Math.max(weekMaxWeight, set.weight);
        }
      }
    }

    if (weekWeights.length < 3) return false;

    const weightDiff = weekWeights[weekWeights.length - 1] - weekWeights[0];
    return Math.abs(weightDiff) < 0.3;
  }

  /**
   * Calculate calories to reduce for stall
   */
  static suggestCalorieAdjustment(currentKcal: number): { newKcal: number; reduction: number } {
    const reduction = 150;
    return {
      newKcal: currentKcal - reduction,
      reduction,
    };
  }

  /**
   * Handle missed workouts: suggest which to prioritize
   */
  static suggestMissedWorkoutPriority(missedCount: number): {
    chestSets: number;
    backSets: number;
    legSets: number;
    armsSets: number;
  } {
    const targets = {
      chestSets: 10,
      backSets: 10,
      legSets: 6,
      armsSets: 8,
    };

    // Proportionally reduce based on missed count
    const factor = 1 - (missedCount * 0.25) / 4;
    return {
      chestSets: Math.ceil(targets.chestSets * factor),
      backSets: Math.ceil(targets.backSets * factor),
      legSets: Math.ceil(targets.legSets * factor),
      armsSets: Math.ceil(targets.armsSets * factor),
    };
  }

  /**
   * Recalculate remaining macro budget after cheat meal
   */
  static recalculateRemainingMacros(
    dailyTarget: { kcal: number; protein: number; carbs: number; fat: number },
    currentMacros: { kcal: number; protein: number; carbs: number; fat: number },
    mealsRemaining: number
  ) {
    const remaining = {
      kcal: Math.max(0, dailyTarget.kcal - currentMacros.kcal),
      protein: Math.max(160, dailyTarget.protein - currentMacros.protein), // Never drop below 160g
      carbs: Math.max(0, dailyTarget.carbs - currentMacros.carbs),
      fat: Math.max(0, dailyTarget.fat - currentMacros.fat),
    };

    // Distribute evenly across remaining meals
    if (mealsRemaining > 0) {
      return {
        kcal: Math.round(remaining.kcal / mealsRemaining),
        protein: Math.round(remaining.protein / mealsRemaining),
        carbs: Math.round(remaining.carbs / mealsRemaining),
        fat: Math.round(remaining.fat / mealsRemaining),
      };
    }

    return remaining;
  }

  /**
   * Generate weekly summary for check-in
   */
  static async generateWeeklySummary(weekNumber: number) {
    const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const workoutSessions = await db.workoutSessions.where('date').above(weekStart).toArray();
    const dailyLogs = await db.dailyLogs.where('date').above(weekStart).toArray();
    const user = await db.user.toCollection().first();

    if (!user) throw new Error('User not found');

    const workoutCount = workoutSessions.length;
    const avgWeight = dailyLogs.length > 0 ? dailyLogs.reduce((sum, log) => sum + (log.bodyWeight || 0), 0) / dailyLogs.length : 0;
    const daysOnTarget = dailyLogs.filter((log) => {
      const dayTarget = log.dayType === 'training' ? user.macroTargets.trainingDay : user.macroTargets.restDay;
      const proteinOk = Math.abs(log.totalProtein - dayTarget.protein) <= 20;
      const carbsOk = Math.abs(log.totalCarbs - dayTarget.carbs) <= 30;
      return proteinOk && carbsOk;
    }).length;

    const avgKnee = workoutSessions.length > 0 ? workoutSessions.reduce((sum, s) => sum + s.kneeDiscomfort, 0) / workoutSessions.length : 0;
    const avgBack = workoutSessions.length > 0 ? workoutSessions.reduce((sum, s) => sum + s.backDiscomfort, 0) / workoutSessions.length : 0;

    return {
      weekNumber,
      workoutCount,
      avgWeight: Math.round(avgWeight * 10) / 10,
      daysOnTarget,
      avgKnee: Math.round(avgKnee * 10) / 10,
      avgBack: Math.round(avgBack * 10) / 10,
      summary: this.generatePlainLanguageSummary(
        weekNumber,
        workoutCount,
        avgWeight,
        daysOnTarget,
        avgKnee,
        avgBack,
        user
      ),
    };
  }

  /**
   * Generate human-readable weekly summary
   */
  private static generatePlainLanguageSummary(
    weekNumber: number,
    workoutCount: number,
    avgWeight: number,
    daysOnTarget: number,
    avgKnee: number,
    avgBack: number,
    user: User
  ): string {
    let summary = `Week ${weekNumber}:\n\n`;

    // Workout adherence
    summary += `✓ You completed ${workoutCount} workouts. `;
    if (workoutCount >= 3) {
      summary += 'Great job staying consistent.\n';
    } else if (workoutCount === 0) {
      summary += 'Consider getting back on track next week.\n';
    } else {
      summary += 'Could aim for more sessions next week.\n';
    }

    // Weight progress
    if (avgWeight > 0) {
      summary += `Current weight: ${avgWeight} kg. `;
      // Could compare to previous week here
      summary += '\n';
    }

    // Nutrition
    summary += `Protein target hit ${daysOnTarget} of 7 days. `;
    if (daysOnTarget >= 5) {
      summary += 'Excellent nutrition adherence.\n';
    } else if (daysOnTarget >= 3) {
      summary += 'Good effort, keep tracking.\n';
    } else {
      summary += 'Focus on hitting protein targets consistently.\n';
    }

    // Pain status
    if (avgKnee > 0) {
      summary += `Knee condition: ${Math.round(avgKnee)}/10. `;
      if (avgKnee > 5) {
        summary += 'Monitor closely.\n';
      } else {
        summary += 'Stable.\n';
      }
    }

    if (avgBack > 0) {
      summary += `Lower back condition: ${Math.round(avgBack)}/10. `;
      if (avgBack > 5) {
        summary += 'Consider deload week.\n';
      } else {
        summary += 'Stable.\n';
      }
    }

    summary += '\nYou are on track for the next phase.';

    return summary;
  }

  /**
   * Determine if user should progress to next phase
   */
  static async recommendPhaseProgression(currentPhaseId: string): Promise<'continue' | 'repeat' | 'adjust'> {
    const phase = await db.phases.get(currentPhaseId);
    if (!phase) return 'continue';

    const weekStart = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const sessions = await db.workoutSessions.where('date').above(weekStart).toArray();
    const logs = await db.dailyLogs.where('date').above(weekStart).toArray();

    const workoutAdherence = sessions.length / 3; // Assume 3 sessions per week
    const nutritionAdherence = logs.filter((log) => {
      const target = log.dayType === 'training' ? 2400 : 2100;
      return Math.abs(log.totalKcal - target) < 200;
    }).length / logs.length;

    // Recommend repeat if adherence is low
    if (workoutAdherence < 0.6 || nutritionAdherence < 0.5) {
      return 'repeat';
    }

    // Recommend adjust if some pain issues
    const avgPain = sessions.reduce((sum, s) => sum + Math.max(s.kneeDiscomfort, s.backDiscomfort), 0) / sessions.length;
    if (avgPain > 6) {
      return 'adjust';
    }

    // Otherwise continue
    return 'continue';
  }
}
