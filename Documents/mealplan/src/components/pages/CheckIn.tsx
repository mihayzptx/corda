'use client';

import { useState } from 'react';
import { db } from '@/lib/db';
import { AdaptiveEngine } from '@/lib/adaptiveEngine';
import { v4 as uuidv4 } from 'uuid';
import type { WeeklyCheckin } from '@/types';

export function CheckInPage() {
  const [avgWeight, setAvgWeight] = useState<number | undefined>();
  const [waistCm, setWaistCm] = useState<number | undefined>();
  const [energyAvg, setEnergyAvg] = useState(5);
  const [sleepAvg, setSleepAvg] = useState(5);
  const [kneeAvg, setKneeAvg] = useState(5);
  const [backAvg, setBackAvg] = useState(5);
  const [workoutCompleted, setWorkoutCompleted] = useState(3);
  const [workoutPlanned] = useState(3);
  const [nutritionHits, setNutritionHits] = useState(5);
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const handleSubmit = async () => {
    const user = await db.user.toCollection().first();
    const weekNumber = Math.ceil((Date.now() - (user?.startDate || Date.now())) / (7 * 24 * 60 * 60 * 1000));

    const checkin: WeeklyCheckin = {
      id: uuidv4(),
      weekNumber,
      date: Date.now(),
      avgWeight: avgWeight || 0,
      waistCm,
      energyAvg,
      sleepAvg,
      kneeAvg,
      backAvg,
      workoutAdherence: { completed: workoutCompleted, planned: workoutPlanned },
      nutritionAdherence: { hitsTarget: nutritionHits, total: 7 },
      notes,
      phaseRecommendation: 'continue',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.weeklyCheckins.add(checkin);

    // Generate summary
    const generatedSummary = `Week ${weekNumber}:\n\n✓ You completed ${workoutCompleted} workouts. ${workoutCompleted >= 3 ? 'Great job staying consistent.' : workoutCompleted === 0 ? 'Consider getting back on track next week.' : 'Could aim for more sessions next week.'}\n\nCurrent weight: ${avgWeight} kg.\n\nProtein target hit ${nutritionHits} of 7 days. ${nutritionHits >= 5 ? 'Excellent nutrition adherence.' : nutritionHits >= 3 ? 'Good effort, keep tracking.' : 'Focus on hitting protein targets consistently.'}\n\nKnee condition: ${Math.round(kneeAvg)}/10. ${kneeAvg > 5 ? 'Monitor closely.' : 'Stable.'}\n\nLower back condition: ${Math.round(backAvg)}/10. ${backAvg > 5 ? 'Consider deload week.' : 'Stable.'}\n\nYou are on track for the next phase.`;

    setSummary(generatedSummary);
    setShowSummary(true);
  };

  if (showSummary) {
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Weekly Summary</h1>
        </div>

        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="whitespace-pre-line text-zinc-300 leading-relaxed mb-6">{summary}</div>

          <button
            onClick={() => {
              setShowSummary(false);
              setAvgWeight(undefined);
              setWaistCm(undefined);
              setEnergyAvg(5);
              setSleepAvg(5);
              setKneeAvg(5);
              setBackAvg(5);
              setWorkoutCompleted(3);
              setNutritionHits(5);
              setNotes('');
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 rounded transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Weekly Check-in</h1>
        <p className="text-zinc-400 text-sm">Reflect on your week and track progress</p>
      </div>

      {/* Body Metrics */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
        <h2 className="font-semibold mb-4">Body Metrics</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Average Weight (kg)</label>
            <input
              type="number"
              value={avgWeight || ''}
              onChange={(e) => setAvgWeight(e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
              step="0.1"
            />
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Waist Circumference (cm)</label>
            <input
              type="number"
              value={waistCm || ''}
              onChange={(e) => setWaistCm(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Subjective Metrics */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6 space-y-4">
        <h2 className="font-semibold mb-4">How are you feeling?</h2>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">Energy Level</label>
            <span className="text-orange-500 font-bold">{energyAvg}/10</span>
          </div>
          <input type="range" min="1" max="10" value={energyAvg} onChange={(e) => setEnergyAvg(parseInt(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">Sleep Quality</label>
            <span className="text-orange-500 font-bold">{sleepAvg}/10</span>
          </div>
          <input type="range" min="1" max="10" value={sleepAvg} onChange={(e) => setSleepAvg(parseInt(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">Knee Condition</label>
            <span className="text-orange-500 font-bold">{kneeAvg}/10</span>
          </div>
          <input type="range" min="1" max="10" value={kneeAvg} onChange={(e) => setKneeAvg(parseInt(e.target.value))} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm">Lower Back Condition</label>
            <span className="text-orange-500 font-bold">{backAvg}/10</span>
          </div>
          <input type="range" min="1" max="10" value={backAvg} onChange={(e) => setBackAvg(parseInt(e.target.value))} className="w-full" />
        </div>
      </div>

      {/* Adherence */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
        <h2 className="font-semibold mb-4">Adherence</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Workouts Completed</label>
            <input
              type="number"
              value={workoutCompleted}
              onChange={(e) => setWorkoutCompleted(parseInt(e.target.value))}
              max={workoutPlanned}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
            />
            <p className="text-xs text-zinc-500 mt-1">Planned: {workoutPlanned}</p>
          </div>
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Nutrition Target Hit (days)</label>
            <input
              type="number"
              value={nutritionHits}
              onChange={(e) => setNutritionHits(parseInt(e.target.value))}
              max={7}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
            />
            <p className="text-xs text-zinc-500 mt-1">Out of 7</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
        <label className="text-sm text-zinc-400 block mb-2">Weekly Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 h-24"
          placeholder="Anything else you want to note about the week?"
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mb-4"
      >
        ✓ Complete Check-in
      </button>
    </div>
  );
}
