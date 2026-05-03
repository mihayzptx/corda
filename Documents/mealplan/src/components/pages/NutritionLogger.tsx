'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { useDailyLog, useFoods } from '@/hooks/useNutrition';
import { calculateFoodMacros } from '@/lib/foodFetch';
import { useUser } from '@/hooks/useUser';
import { v4 as uuidv4 } from 'uuid';
import type { DailyLog, Meal, FoodEntry, FoodItem } from '@/types';

export function NutritionLogger() {
  const { user } = useUser();
  const { log: todayLog, saveLog } = useDailyLog();
  const { foods, search } = useFoods();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dayType, setDayType] = useState<'training' | 'rest'>('training');
  const [bodyWeight, setBodyWeight] = useState<number | undefined>();
  const [energyLevel, setEnergyLevel] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [selectedMealIndex, setSelectedMealIndex] = useState(0);

  useEffect(() => {
    if (todayLog) {
      setMeals(todayLog.meals);
      setDayType(todayLog.dayType);
      setBodyWeight(todayLog.bodyWeight);
      setEnergyLevel(todayLog.energyLevel);
      setSleepQuality(todayLog.sleepQuality);
      setNotes(todayLog.notes || '');
    } else {
      // Create 5 empty meals
      const emptyMeals: Meal[] = Array.from({ length: 5 }, (_, i) => ({
        id: uuidv4(),
        name: `Meal ${i + 1}`,
        time: Date.now(),
        foodEntries: [],
        isCheatMeal: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }));
      setMeals(emptyMeals);
    }
  }, [todayLog]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      setSearchResults(search(query).slice(0, 10));
    } else {
      setSearchResults([]);
    }
  };

  const addFoodToMeal = (food: FoodItem, quantity: number = 100) => {
    const newMeals = [...meals];
    const entry: FoodEntry = {
      foodId: food.id,
      quantity,
      unit: 'grams',
    };
    newMeals[selectedMealIndex].foodEntries.push(entry);
    setMeals(newMeals);
    setSearchQuery('');
    setSearchResults([]);
  };

  const calculateMealMacros = (meal: Meal) => {
    let kcal = 0,
      protein = 0,
      carbs = 0,
      fat = 0;
    meal.foodEntries.forEach((entry) => {
      const food = foods.find((f) => f.id === entry.foodId);
      if (food) {
        const macros = calculateFoodMacros(food, entry.quantity, entry.unit);
        kcal += macros.calories;
        protein += macros.protein;
        carbs += macros.carbs;
        fat += macros.fat;
      }
    });
    return { kcal: Math.round(kcal), protein: Math.round(protein * 10) / 10, carbs: Math.round(carbs * 10) / 10, fat: Math.round(fat * 10) / 10 };
  };

  const totalMacros = meals.reduce(
    (acc, meal) => {
      const macros = calculateMealMacros(meal);
      return {
        kcal: acc.kcal + macros.kcal,
        protein: acc.protein + macros.protein,
        carbs: acc.carbs + macros.carbs,
        fat: acc.fat + macros.fat,
      };
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const dayTarget = dayType === 'training' ? user?.macroTargets.trainingDay : user?.macroTargets.restDay;

  const saveDailyLog = async () => {
    const log: DailyLog = {
      id: uuidv4(),
      date: Math.floor(Date.now() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000),
      dayType,
      meals,
      totalKcal: totalMacros.kcal,
      totalProtein: totalMacros.protein,
      totalCarbs: totalMacros.carbs,
      totalFat: totalMacros.fat,
      bodyWeight,
      energyLevel,
      sleepQuality,
      notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveLog(log);
  };

  const currentMeal = meals && meals[selectedMealIndex];
  const currentMealMacros = currentMeal ? calculateMealMacros(currentMeal) : { kcal: 0, protein: 0, carbs: 0, fat: 0 };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Today's Nutrition</h1>
        <p className="text-zinc-400 text-sm">
          {totalMacros.kcal} / {dayTarget?.kcal || 2400} kcal
        </p>
      </div>

      {/* Daily Overview */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-zinc-400">Calories</span>
              <span>{totalMacros.kcal} / {dayTarget?.kcal}</span>
            </div>
            <div className="w-full bg-zinc-800 rounded h-2">
              <div
                className="bg-orange-500 h-2 rounded"
                style={{ width: `${Math.min((totalMacros.kcal / (dayTarget?.kcal || 2400)) * 100, 100)}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-zinc-400">Protein</span>
              <span>{totalMacros.protein}g / {dayTarget?.protein}g</span>
            </div>
            <div className="w-full bg-zinc-800 rounded h-2">
              <div
                className={`h-2 rounded ${totalMacros.protein >= (dayTarget?.protein || 160) ? 'bg-green-500' : 'bg-orange-500'}`}
                style={{ width: `${Math.min((totalMacros.protein / (dayTarget?.protein || 160)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Day Type & Body Weight */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6 space-y-3">
        <div>
          <label className="text-sm text-zinc-400 block mb-2">Day Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setDayType('training')}
              className={`flex-1 py-2 rounded font-medium transition-colors ${
                dayType === 'training' ? 'bg-orange-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              Training Day
            </button>
            <button
              onClick={() => setDayType('rest')}
              className={`flex-1 py-2 rounded font-medium transition-colors ${
                dayType === 'rest' ? 'bg-orange-500 text-black' : 'bg-zinc-800 hover:bg-zinc-700'
              }`}
            >
              Rest Day
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm text-zinc-400 block mb-2">Body Weight (kg)</label>
          <input
            type="number"
            value={bodyWeight || ''}
            onChange={(e) => setBodyWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
            step="0.1"
          />
        </div>
      </div>

      {/* Meals */}
      <div className="mb-6">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {meals.map((meal, idx) => (
            <button
              key={meal.id}
              onClick={() => setSelectedMealIndex(idx)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                selectedMealIndex === idx
                  ? 'bg-orange-500 text-black font-medium'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {meal.name}
            </button>
          ))}
        </div>

        {/* Current Meal */}
        {currentMeal && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">{currentMeal.name}</h3>
            <p className="text-xs text-zinc-400">
              {currentMealMacros.kcal} kcal • {currentMealMacros.protein}g protein
            </p>
          </div>

          {/* Foods in meal */}
          {currentMeal && currentMeal.foodEntries && currentMeal.foodEntries.length > 0 && (
            <div className="space-y-2 mb-4 pb-4 border-b border-zinc-800">
              {currentMeal.foodEntries.map((entry, idx) => {
                const food = foods.find((f) => f.id === entry.foodId);
                return food ? (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-zinc-300">
                      {food.name} ({entry.quantity}g)
                    </span>
                    <span className="text-zinc-400">{Math.round(calculateFoodMacros(food, entry.quantity, entry.unit).calories)} kcal</span>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {/* Food search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm mb-2"
            />
            {searchResults.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => addFoodToMeal(food)}
                    className="w-full text-left bg-zinc-800 hover:bg-zinc-700 p-2 rounded text-sm transition-colors"
                  >
                    <div className="font-medium">{food.name}</div>
                    <div className="text-xs text-zinc-400">{food.calories} kcal/100g</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* Energy & Sleep */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6 space-y-4">
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <label>Energy Level</label>
            <span className="text-orange-500">{energyLevel}/10</span>
          </div>
          <input type="range" min="1" max="10" value={energyLevel} onChange={(e) => setEnergyLevel(parseInt(e.target.value))} className="w-full" />
        </div>
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <label>Sleep Quality</label>
            <span className="text-orange-500">{sleepQuality}/10</span>
          </div>
          <input type="range" min="1" max="10" value={sleepQuality} onChange={(e) => setSleepQuality(parseInt(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
        <label className="text-sm text-zinc-400 block mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm h-16"
          placeholder="How was your nutrition today?"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveDailyLog}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mb-4"
      >
        ✓ Save Daily Log
      </button>
    </div>
  );
}
