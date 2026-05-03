import { db } from './db';
import type { FoodItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Open Food Facts API integration
 */
export const openFoodFactsAPI = {
  async search(query: string, limit: number = 10) {
    try {
      const params = new URLSearchParams({
        search_terms: query,
        search_simple: '1',
        json: '1',
        page_size: limit.toString(),
      });

      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'User-Agent': 'MealPlanTracker/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      return (data.products || [])
        .map((product: any) => ({
          id: uuidv4(),
          name: product.product_name || 'Unknown',
          calories: product.nutriments?.['energy-kcal_100g'] || 0,
          protein: product.nutriments?.['proteins_100g'] || 0,
          carbs: product.nutriments?.['carbohydrates_100g'] || 0,
          fat: product.nutriments?.['fat_100g'] || 0,
          fiber: product.nutriments?.['fiber_100g'] || 0,
          barcode: product.code,
          isCustom: false,
          source: 'openfoodfacts' as const,
          category: product.categories_tags?.[0] || 'uncategorized',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }))
        .filter((f: FoodItem) => f.calories > 0); // Filter out items with no nutritional data
    } catch (error) {
      console.error('Open Food Facts error:', error);
      throw error;
    }
  },

  async importFoodItem(food: FoodItem) {
    // Check for duplicates by name similarity
    const existing = await db.foodItems.where('name').equals(food.name).first();
    if (existing) {
      throw new Error(`Food "${food.name}" already exists in database`);
    }

    const newFood: FoodItem = {
      ...food,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.foodItems.add(newFood);
    return newFood;
  },
};

/**
 * USDA FoodData Central API integration
 */
export const usdaAPI = {
  // Using demo key by default, user can set their own in settings
  apiKey: 'demo_key',

  setApiKey(key: string) {
    this.apiKey = key;
  },

  async search(query: string, limit: number = 10) {
    try {
      const params = new URLSearchParams({
        query,
        pageSize: limit.toString(),
        api_key: this.apiKey,
      });

      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('USDA API key invalid or expired. Update in settings.');
        }
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();

      return (data.foods || [])
        .map((food: any) => {
          const nutrients = food.foodNutrients || [];
          const getKcal = (nutrient: string) => {
            const n = nutrients.find((x: any) => x.nutrientName?.includes(nutrient));
            return n?.value || 0;
          };

          return {
            id: uuidv4(),
            name: food.description || 'Unknown',
            calories: getKcal('Energy'),
            protein: getKcal('Protein'),
            carbs: getKcal('Carbohydrate'),
            fat: getKcal('Total lipid'),
            fiber: getKcal('Fiber'),
            barcode: food.gtinUpc,
            isCustom: false,
            source: 'usda' as const,
            category: food.foodCategory?.description || 'uncategorized',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
        })
        .filter((f: FoodItem) => f.calories > 0);
    } catch (error) {
      console.error('USDA API error:', error);
      throw error;
    }
  },

  async importFoodItem(food: FoodItem) {
    // Check for duplicates
    const existing = await db.foodItems.where('name').equals(food.name).first();
    if (existing) {
      throw new Error(`Food "${food.name}" already exists in database`);
    }

    const newFood: FoodItem = {
      ...food,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.foodItems.add(newFood);
    return newFood;
  },
};

/**
 * Calculate macros for a food quantity
 */
export function calculateFoodMacros(
  food: FoodItem,
  quantity: number,
  unit: 'grams' | 'serving'
): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
} {
  const multiplier = unit === 'grams' ? quantity / 100 : quantity;

  return {
    calories: Math.round(food.calories * multiplier),
    protein: Math.round(food.protein * multiplier * 10) / 10,
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    fat: Math.round(food.fat * multiplier * 10) / 10,
    fiber: Math.round((food.fiber || 0) * multiplier * 10) / 10,
  };
}

/**
 * Calculate total macros from food entries
 */
export function calculateMealMacros(
  foods: { food: FoodItem; quantity: number; unit: 'grams' | 'serving' }[]
) {
  return foods.reduce(
    (acc, { food, quantity, unit }) => {
      const macros = calculateFoodMacros(food, quantity, unit);
      return {
        calories: acc.calories + macros.calories,
        protein: acc.protein + macros.protein,
        carbs: acc.carbs + macros.carbs,
        fat: acc.fat + macros.fat,
        fiber: acc.fiber + macros.fiber,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }
  );
}
