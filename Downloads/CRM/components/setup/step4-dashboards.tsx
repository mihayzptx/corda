import React from 'react';
import { SetupState } from '@/lib/setup-state';

interface Step4Props {
  state: SetupState;
  updateState: (updates: Partial<SetupState>) => void;
}

export function Step4Dashboards({ state, updateState }: Step4Props) {
  const toggleView = (id: string) => {
    updateState({
      dashboards: {
        ...state.dashboards,
        views: state.dashboards.views.map((v) =>
          v.id === id ? { ...v, enabled: !v.enabled } : v
        ),
      },
    });
  };

  const toggleNotify = (id: string) => {
    updateState({
      dashboards: {
        ...state.dashboards,
        views: state.dashboards.views.map((v) =>
          v.id === id ? { ...v, notify: !v.notify } : v
        ),
      },
    });
  };

  const onOpenAddView = () => {
    updateState({ showAddView: true, newViewName: '', newViewDesc: '' });
  };

  const onCancelAddView = () => {
    updateState({ showAddView: false });
  };

  const onConfirmAddView = () => {
    const name = state.newViewName.trim();
    const desc = state.newViewDesc.trim();
    if (!name || !desc) return;
    updateState({
      dashboards: {
        ...state.dashboards,
        views: [...state.dashboards.views, { id: `view-${Math.random().toString(36).slice(2, 9)}`, name, desc, enabled: true, notify: false }],
      },
      showAddView: false,
      newViewName: '',
      newViewDesc: '',
    });
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">Set up dashboards &amp; notifications</h2>
      <p className="mb-6 text-sm opacity-70">
        Dashboards are work views your team checks daily, not static reports. Turn on notifications to get pinged when a view has new items.
      </p>

      {state.dashboards.loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : state.dashboards.error ? (
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">Couldn't generate suggested views. Try again or add one yourself below.</p>
        </div>
      ) : null}

      <div className="space-y-3 mb-4">
        {state.dashboards.views.map((view) => (
          <div key={view.id} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{view.name}</div>
              <p className="mt-1 text-sm text-gray-600">{view.desc}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleNotify(view.id)}
                className={`p-2 rounded-lg border ${
                  view.notify
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}
                aria-label="Notify"
              >
                🔔
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={view.enabled}
                  onChange={() => toggleView(view.id)}
                  className="h-5 w-5"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      {state.showAddView && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 mb-4">
          <div>
            <label htmlFor="view-name" className="block text-sm font-medium mb-1">
              View name
            </label>
            <input
              id="view-name"
              type="text"
              placeholder="e.g. Unassigned jobs"
              value={state.newViewName}
              onChange={(e) => updateState({ newViewName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="view-desc" className="block text-sm font-medium mb-1">
              Filter logic
            </label>
            <input
              id="view-desc"
              type="text"
              placeholder="e.g. Jobs with no assigned technician"
              value={state.newViewDesc}
              onChange={(e) => updateState({ newViewDesc: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancelAddView}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmAddView}
              disabled={!(state.newViewName.trim() && state.newViewDesc.trim())}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Add view
            </button>
          </div>
        </div>
      )}

      {!state.showAddView && (
        <button
          onClick={onOpenAddView}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          + Add custom view
        </button>
      )}
    </div>
  );
}
