import React from 'react';
import { SetupState } from '@/lib/setup-state';

const ICONS: Record<string, string> = {
  contacts: '👤',
  companies: '🏢',
  deals: '📈',
  custom: '📦',
};

interface Step1Props {
  state: SetupState;
  updateState: (updates: Partial<SetupState>) => void;
}

export function Step1Items({ state, updateState }: Step1Props) {
  const toggleItem = (id: string) => {
    updateState({
      items: state.items.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it)),
    });
  };

  const deleteItem = (id: string) => {
    updateState({ items: state.items.filter((it) => it.id !== id) });
  };

  const onOpenAddItem = () => {
    updateState({ showAddItem: true, newItemName: '', newItemPipeline: false });
  };

  const onCancelAddItem = () => {
    updateState({ showAddItem: false });
  };

  const onConfirmAddItem = () => {
    const name = state.newItemName.trim();
    if (!name) return;
    const newItem = {
      id: `item-${Math.random().toString(36).slice(2, 9)}`,
      name,
      desc: 'Custom item you added during setup.',
      enabled: true,
      custom: true,
      needsPipeline: state.newItemPipeline,
    };
    updateState({
      items: [...state.items, newItem],
      showAddItem: false,
      newItemName: '',
      newItemPipeline: false,
    });
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">Set up your items</h2>
      <p className="mb-6 text-sm opacity-70">
        Items are the records your team tracks day to day. Turn on the ones you need — you can change this anytime.
      </p>

      <div className="space-y-3">
        {state.items.map((it) => (
          <div key={it.id} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-lg">{ICONS[it.custom ? 'custom' : it.id] || ICONS.custom}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="font-semibold">{it.name}</div>
                {it.custom && <span className="inline-block text-xs bg-gray-200 px-2 py-1 rounded">Custom</span>}
                {it.needsPipeline && <span className="inline-block text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Has pipeline</span>}
              </div>
              <p className="mt-1 text-sm text-gray-600">{it.desc}</p>
            </div>
            {it.custom && (
              <button
                onClick={() => deleteItem(it.id)}
                className="text-gray-400 hover:text-red-600"
                aria-label="Remove item"
              >
                ✕
              </button>
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={it.enabled}
                onChange={() => toggleItem(it.id)}
                className="h-5 w-5"
              />
            </label>
          </div>
        ))}

        {state.showAddItem && (
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
            <div>
              <label htmlFor="new-item-name" className="block text-sm font-medium mb-1">
                Item name
              </label>
              <input
                id="new-item-name"
                type="text"
                placeholder="e.g. Assets, Projects, Locations"
                value={state.newItemName}
                onChange={(e) => updateState({ newItemName: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm">This item needs its own pipeline</label>
              <input
                type="checkbox"
                checked={state.newItemPipeline}
                onChange={() => updateState({ newItemPipeline: !state.newItemPipeline })}
                className="h-5 w-5"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={onCancelAddItem}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={onConfirmAddItem}
                disabled={!state.newItemName.trim()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              >
                Add item
              </button>
            </div>
          </div>
        )}

        {!state.showAddItem && (
          <button
            onClick={onOpenAddItem}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            + Add custom item
          </button>
        )}
      </div>
    </div>
  );
}
