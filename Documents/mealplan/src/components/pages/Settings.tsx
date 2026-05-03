'use client';

import { useUser } from '@/hooks/useUser';
import { db } from '@/lib/db';
import { useState } from 'react';

export function SettingsPage() {
  const { user, updateUser, loading } = useUser();
  const [formState, setFormState] = useState(user || null);
  const [saveMessage, setSaveMessage] = useState('');
  const [usdaApiKey, setUsdaApiKey] = useState('demo_key');

  const handleSaveProfile = async () => {
    if (formState && user) {
      await updateUser({
        name: formState.name,
        age: formState.age,
        height: formState.height,
        weight: formState.weight,
        macroTargets: formState.macroTargets,
      });
      setSaveMessage('Profile saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handleExportData = async () => {
    // Collect all data
    const userData = await db.user.toArray();
    const exercises = await db.exercises.toArray();
    const foods = await db.foodItems.toArray();
    const workouts = await db.workoutSessions.toArray();
    const nutrition = await db.dailyLogs.toArray();

    const backup = {
      exportDate: new Date().toISOString(),
      user: userData,
      exercises,
      foods,
      workouts,
      nutrition,
    };

    const dataStr = JSON.stringify(backup, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mealplan-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure? This will delete all data permanently.')) {
      await db.delete();
      location.reload();
    }
  };

  if (loading) {
    return <div className="p-4">Loading settings...</div>;
  }

  if (!user || !formState) {
    return <div className="p-4">No user found</div>;
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
      </div>

      {/* Save Message */}
      {saveMessage && <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-2 rounded mb-4">{saveMessage}</div>}

      {/* Profile Section */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
        <h2 className="font-semibold text-lg mb-4">Profile</h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 block mb-2">Name</label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Age</label>
              <input
                type="number"
                value={formState.age}
                onChange={(e) => setFormState({ ...formState, age: parseInt(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 block mb-2">Height (cm)</label>
              <input
                type="number"
                value={formState.height}
                onChange={(e) => setFormState({ ...formState, height: parseInt(e.target.value) })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-400 block mb-2">Current Weight (kg)</label>
            <input
              type="number"
              value={formState.weight}
              onChange={(e) => setFormState({ ...formState, weight: parseFloat(e.target.value) })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2"
              step="0.1"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 rounded transition-colors"
          >
            Save Profile
          </button>
        </div>
      </div>

      {/* Macro Targets */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
        <h2 className="font-semibold text-lg mb-4">Macro Targets</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-3 text-orange-500">Training Day</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Calories</label>
                <input
                  type="number"
                  value={formState.macroTargets.trainingDay.kcal}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      macroTargets: {
                        ...formState.macroTargets,
                        trainingDay: {
                          ...formState.macroTargets.trainingDay,
                          kcal: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={formState.macroTargets.trainingDay.protein}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      macroTargets: {
                        ...formState.macroTargets,
                        trainingDay: {
                          ...formState.macroTargets.trainingDay,
                          protein: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3 text-blue-500">Rest Day</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Calories</label>
                <input
                  type="number"
                  value={formState.macroTargets.restDay.kcal}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      macroTargets: {
                        ...formState.macroTargets,
                        restDay: {
                          ...formState.macroTargets.restDay,
                          kcal: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={formState.macroTargets.restDay.protein}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      macroTargets: {
                        ...formState.macroTargets,
                        restDay: {
                          ...formState.macroTargets.restDay,
                          protein: parseInt(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black font-medium py-2 rounded transition-colors"
          >
            Save Macro Targets
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
        <h2 className="font-semibold text-lg mb-4">API Keys</h2>

        <div>
          <label className="text-sm text-zinc-400 block mb-2">USDA API Key</label>
          <input
            type="password"
            value={usdaApiKey}
            onChange={(e) => setUsdaApiKey(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 mb-2"
            placeholder="Get free key from api.nal.usda.gov"
          />
          <p className="text-xs text-zinc-500">
            Optional. Leave blank to use demo mode. Get a free key at{' '}
            <a href="https://fdc.nal.usda.gov/api-key-signup.html" className="text-orange-500">
              USDA FoodData Central
            </a>
          </p>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 mb-6">
        <h2 className="font-semibold text-lg mb-4">Data Management</h2>

        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors"
          >
            📥 Export Data as JSON
          </button>
          <button
            onClick={handleReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition-colors"
          >
            ⚠️ Reset App (Delete All Data)
          </button>
        </div>
      </div>

      {/* About */}
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="font-semibold text-lg mb-4">About</h2>
        <div className="space-y-2 text-sm text-zinc-400">
          <p>Body Recomposition Tracker v1.0</p>
          <p>A comprehensive long-term fitness companion for tracking workouts, nutrition, and progress.</p>
          <p>Data is stored locally on your device using IndexedDB.</p>
        </div>
      </div>
    </div>
  );
}
