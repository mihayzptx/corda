import React from 'react';
import Link from 'next/link';
import { SetupState } from '@/lib/setup-state';

interface FinishScreenProps {
  state: SetupState;
  onRestart: () => void;
}

export function FinishScreen({ state, onRestart }: FinishScreenProps) {
  const enabledCount = state.items.filter((it) => it.enabled).length;
  const stageCount = Object.values(state.pipelines).reduce(
    (n, p) => n + (p.stages ? p.stages.length : 0),
    0
  );
  const ruleCount = state.workflow.rules.filter((r) => r.enabled).length;
  const viewCount = state.dashboards.views.filter((v) => v.enabled).length;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="rounded-lg border border-gray-200 bg-white p-8 max-w-md text-center space-y-4">
        <div className="flex h-11 w-11 items-center justify-center border border-blue-600 text-blue-600 rounded-lg mx-auto">
          ✓
        </div>
        <h3 className="text-xl font-semibold">You're all set</h3>
        <p className="text-sm text-gray-600">
          {enabledCount} items enabled, {stageCount} pipeline stages, {ruleCount} workflow rules and {viewCount} dashboard views are ready to go.
        </p>
        <Link
          href="/pipeline"
          className="block rounded-lg bg-blue-600 px-4 py-2 text-white text-sm font-medium"
        >
          Enter CRM
        </Link>
        <button
          onClick={onRestart}
          className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
