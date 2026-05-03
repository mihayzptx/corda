import { db } from './db';
import { seedExercises } from './seedExercises';
import { seedFoods, generateMealTemplates } from './seedFoods';

export async function seedDatabase() {
  try {
    // Check if already seeded
    const exerciseCount = await db.exercises.count();
    if (exerciseCount > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database...');

    // Seed exercises
    await db.exercises.bulkAdd(seedExercises);
    console.log(`✓ Seeded ${seedExercises.length} exercises`);

    // Seed foods
    await db.foodItems.bulkAdd(seedFoods);
    console.log(`✓ Seeded ${seedFoods.length} food items`);

    // Generate and seed meal templates
    const mealTemplates = generateMealTemplates();
    await db.mealTemplates.bulkAdd(mealTemplates);
    console.log(`✓ Seeded ${mealTemplates.length} meal templates`);

    // Create default workout templates
    const user = await db.user.toCollection().first();
    if (user) {
      const upperAExercises = seedExercises
        .filter((e) => ['chest', 'back', 'shoulders', 'biceps', 'triceps'].includes(e.muscleGroups[0]))
        .slice(0, 8)
        .map((e) => e.id);

      const upperBExercises = seedExercises
        .filter((e) => ['shoulders', 'back', 'triceps'].includes(e.muscleGroups[0]))
        .slice(0, 8)
        .map((e) => e.id);

      const lowerExercises = seedExercises
        .filter((e) => ['glutes', 'hamstrings', 'quads', 'calves'].includes(e.muscleGroups[0]))
        .slice(0, 8)
        .map((e) => e.id);

      const coreSets = [
        {
          id: 'template-upperA',
          name: 'Upper Body A',
          type: 'upperA' as const,
          exerciseIds: upperAExercises,
          defaultSets: 3,
          defaultReps: { min: 8, max: 12 },
          defaultRPE: 6,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'template-upperB',
          name: 'Upper Body B',
          type: 'upperB' as const,
          exerciseIds: upperBExercises,
          defaultSets: 3,
          defaultReps: { min: 8, max: 12 },
          defaultRPE: 6,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          id: 'template-lower',
          name: 'Lower Body',
          type: 'lower' as const,
          exerciseIds: lowerExercises,
          defaultSets: 3,
          defaultReps: { min: 8, max: 12 },
          defaultRPE: 6,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ];

      await db.workoutTemplates.bulkAdd(coreSets);
      console.log(`✓ Created 3 default workout templates`);
    }

    console.log('✅ Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
