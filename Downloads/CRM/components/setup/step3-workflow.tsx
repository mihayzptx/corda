import React from 'react';
import { SetupState } from '@/lib/setup-state';

interface Step3Props {
  state: SetupState;
  updateState: (updates: Partial<SetupState>) => void;
}

export function Step3Workflow({ state, updateState }: Step3Props) {
  const toggleRule = (id: string) => {
    updateState({
      workflow: {
        ...state.workflow,
        rules: state.workflow.rules.map((r) =>
          r.id === id ? { ...r, enabled: !r.enabled } : r
        ),
      },
    });
  };

  const onOpenAddRule = () => {
    updateState({ showAddRule: true, newRuleName: '', newRuleDesc: '' });
  };

  const onCancelAddRule = () => {
    updateState({ showAddRule: false });
  };

  const onConfirmAddRule = () => {
    const name = state.newRuleName.trim();
    const desc = state.newRuleDesc.trim();
    if (!name || !desc) return;
    updateState({
      workflow: {
        ...state.workflow,
        rules: [...state.workflow.rules, { id: `rule-${Math.random().toString(36).slice(2, 9)}`, name, desc, enabled: true }],
      },
      showAddRule: false,
      newRuleName: '',
      newRuleDesc: '',
    });
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">Set up workflow</h2>
      <p className="mb-6 text-sm opacity-70">Automations that run in the background based on what you set up so far.</p>

      {state.workflow.loading ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-200 animate-pulse" />
          ))}
        </div>
      ) : state.workflow.error ? (
        <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">Couldn't generate suggested rules. Try again or add one yourself below.</p>
        </div>
      ) : null}

      <div className="space-y-3 mb-4">
        {state.workflow.rules.map((rule) => (
          <div key={rule.id} className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">{rule.name}</div>
              <p className="mt-1 text-sm text-gray-600">{rule.desc}</p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={() => toggleRule(rule.id)}
                className="h-5 w-5"
              />
            </label>
          </div>
        ))}
      </div>

      {state.showAddRule && (
        <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 mb-4">
          <div>
            <label htmlFor="rule-name" className="block text-sm font-medium mb-1">
              Rule name
            </label>
            <input
              id="rule-name"
              type="text"
              placeholder="e.g. Alert on high-value deal"
              value={state.newRuleName}
              onChange={(e) => updateState({ newRuleName: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="rule-desc" className="block text-sm font-medium mb-1">
              When this happens, do this
            </label>
            <textarea
              id="rule-desc"
              placeholder="e.g. When a deal's value is over $10,000, notify the sales manager"
              value={state.newRuleDesc}
              onChange={(e) => updateState({ newRuleDesc: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onCancelAddRule}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmAddRule}
              disabled={!(state.newRuleName.trim() && state.newRuleDesc.trim())}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Add rule
            </button>
          </div>
        </div>
      )}

      {!state.showAddRule && (
        <button
          onClick={onOpenAddRule}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          + Add custom rule
        </button>
      )}
    </div>
  );
}
