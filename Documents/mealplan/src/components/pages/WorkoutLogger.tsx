'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/db';
import { AdaptiveEngine } from '@/lib/adaptiveEngine';
import { useWorkoutTemplates, useExercises, useSuggestedWeight } from '@/hooks/useWorkout';
import { v4 as uuidv4 } from 'uuid';
import type { WorkoutSession, Exercise, LoggedSet, WorkoutTemplate } from '@/types';

export function WorkoutLogger() {
  const { templates, loading: templatesLoading } = useWorkoutTemplates();
  const { exercises, loading: exercisesLoading } = useExercises();
  const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null);
  const [sessionSets, setSessionSets] = useState<LoggedSet[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [kneeDiscomfort, setKneeDiscomfort] = useState(5);
  const [backDiscomfort, setBackDiscomfort] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [status, setStatus] = useState<'in_progress' | 'completed'>('in_progress');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplate) {
      setSelectedTemplate(templates[0]);
    }
  }, [templates, selectedTemplate]);

  if (templatesLoading || exercisesLoading) {
    return <div className="p-4">Loading workout data...</div>;
  }

  if (!selectedTemplate) {
    return <div className="p-4">No workout templates available</div>;
  }

  const templateExercises = selectedTemplate.exerciseIds
    .map((id) => exercises.find((e) => e.id === id))
    .filter((e) => e !== undefined) as Exercise[];

  const currentExercise = templateExercises[currentExerciseIndex];

  const addSet = () => {
    if (!currentExercise) return;

    const newSet: LoggedSet = {
      id: uuidv4(),
      exerciseId: currentExercise.id,
      weight: 0,
      reps: selectedTemplate.defaultReps.min,
      rpe: selectedTemplate.defaultRPE,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setSessionSets([...sessionSets, newSet]);
  };

  const updateSet = (setId: string, field: keyof LoggedSet, value: any) => {
    setSessionSets(
      sessionSets.map((s) => (s.id === setId ? { ...s, [field]: value, updatedAt: Date.now() } : s))
    );
  };

  const removeSet = (setId: string) => {
    setSessionSets(sessionSets.filter((s) => s.id !== setId));
  };

  const saveSession = async () => {
    const session: WorkoutSession = {
      id: uuidv4(),
      templateId: selectedTemplate.id,
      date: Date.now(),
      status,
      sets: sessionSets,
      notes,
      kneeDiscomfort,
      backDiscomfort,
      energyLevel,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.workoutSessions.add(session);
    // Reset form
    setSessionSets([]);
    setStatus('in_progress');
    setNotes('');
    setKneeDiscomfort(5);
    setBackDiscomfort(5);
    setEnergyLevel(5);
  };

  const exerciseSets = sessionSets.filter((s) => s.exerciseId === currentExercise.id);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{selectedTemplate.name}</h1>
        <p className="text-zinc-400 text-sm">{templateExercises.length} exercises</p>
      </div>

      {/* Template Selection */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
        <label className="text-sm text-zinc-400 uppercase tracking-wider block mb-2">Workout Template</label>
        <select
          value={selectedTemplate.id}
          onChange={(e) => {
            const template = templates.find((t) => t.id === e.target.value);
            if (template) setSelectedTemplate(template);
          }}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-50"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Exercise */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-1">{currentExercise.name}</h2>
          <p className="text-sm text-zinc-400">{currentExercise.muscleGroups.join(', ')}</p>
        </div>

        {/* Exercise Instructions */}
        <p className="text-sm text-zinc-300 mb-4 italic">{currentExercise.instructions}</p>

        {/* Sets for this exercise */}
        <div className="space-y-3 mb-4">
          {exerciseSets.length === 0 && <p className="text-zinc-400 text-sm">No sets logged yet</p>}
          {exerciseSets.map((set) => (
            <div key={set.id} className="bg-zinc-800 p-3 rounded border border-zinc-700">
              <div className="grid grid-cols-4 gap-2 mb-2">
                <div>
                  <label className="text-xs text-zinc-400">Weight (kg)</label>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(set.id, 'weight', parseFloat(e.target.value))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm"
                    step="0.5"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Reps</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(set.id, 'reps', parseInt(e.target.value))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">RPE</label>
                  <select
                    value={set.rpe}
                    onChange={(e) => updateSet(set.id, 'rpe', parseInt(e.target.value))}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-sm"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeSet(set.id)}
                  className="text-red-500 hover:text-red-400 text-sm self-end"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Set Button */}
        <button
          onClick={addSet}
          className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 rounded transition-colors mb-4"
        >
          + Add Set
        </button>

        {/* Navigation */}
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentExerciseIndex(Math.max(0, currentExerciseIndex - 1))}
            disabled={currentExerciseIndex === 0}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 py-2 rounded"
          >
            ← Previous
          </button>
          <span className="flex items-center px-3 text-sm text-zinc-400">
            {currentExerciseIndex + 1} / {templateExercises.length}
          </span>
          <button
            onClick={() => setCurrentExerciseIndex(Math.min(templateExercises.length - 1, currentExerciseIndex + 1))}
            disabled={currentExerciseIndex === templateExercises.length - 1}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 py-2 rounded"
          >
            Next →
          </button>
        </div>
      </div>

      {/* Pain & Energy */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6 space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Knee Discomfort</label>
            <span className="text-orange-500 font-bold">{kneeDiscomfort}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={kneeDiscomfort}
            onChange={(e) => setKneeDiscomfort(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Back Discomfort</label>
            <span className="text-orange-500 font-bold">{backDiscomfort}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={backDiscomfort}
            onChange={(e) => setBackDiscomfort(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Energy Level</label>
            <span className="text-orange-500 font-bold">{energyLevel}/10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
        <label className="text-sm text-zinc-400 uppercase tracking-wider block mb-2">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-zinc-50 h-20"
          placeholder="How did the workout feel? Any form cues?"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={saveSession}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors mb-4"
      >
        ✓ Complete Workout
      </button>
    </div>
  );
}
