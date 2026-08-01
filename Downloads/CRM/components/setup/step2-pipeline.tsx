import React, { useState } from 'react';
import { SetupState } from '@/lib/setup-state';

interface Step2Props {
  state: SetupState;
  updateState: (updates: Partial<SetupState>) => void;
}

export function Step2Pipeline({ state, updateState }: Step2Props) {
  const [dragInfo, setDragInfo] = useState<{ key: string; id: string } | null>(null);

  const pipelineSections = state.pipelineOrder.map((key) => {
    const p = state.pipelines[key] || { loading: true, error: false, stages: [] };
    const item = state.items.find((it) => it.id === key);
    return { key, title: item?.name || key, ...p };
  });

  const updateStageName = (key: string, stageId: string, name: string) => {
    updateState({
      pipelines: {
        ...state.pipelines,
        [key]: {
          ...state.pipelines[key],
          stages: state.pipelines[key].stages.map((st) =>
            st.id === stageId ? { ...st, name } : st
          ),
        },
      },
    });
  };

  const deleteStage = (key: string, stageId: string) => {
    updateState({
      pipelines: {
        ...state.pipelines,
        [key]: {
          ...state.pipelines[key],
          stages: state.pipelines[key].stages.filter((st) => st.id !== stageId),
        },
      },
    });
  };

  const addStage = (key: string) => {
    updateState({
      pipelines: {
        ...state.pipelines,
        [key]: {
          ...state.pipelines[key],
          stages: [...state.pipelines[key].stages, { id: `stage-${Math.random().toString(36).slice(2, 9)}`, name: 'New stage' }],
        },
      },
    });
  };

  return (
    <div>
      <h2 className="mb-1 text-2xl font-semibold">Set up your pipeline</h2>
      <p className="mb-6 text-sm opacity-70">
        Stages your work moves through. Drag to reorder, click a name to rename, or add your own.
      </p>

      {state.pipelineOrder.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-sm text-gray-600">
            Nothing to set up here — you didn't enable any items that use a pipeline. You can add one later from item settings.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {pipelineSections.map((sec) => (
            <div key={sec.key}>
              {state.pipelineOrder.length > 1 && (
                <h4 className="mb-2 text-sm font-semibold text-blue-700">{sec.title} pipeline</h4>
              )}
              {sec.loading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-11 rounded-lg bg-gray-200 animate-pulse" />
                  ))}
                </div>
              ) : sec.error ? (
                <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
                  <p className="text-sm text-yellow-800">
                    Couldn't generate suggested stages. You can try again or add stages yourself.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sec.stages.map((stage, idx) => (
                    <div key={stage.id} className="flex gap-2 rounded-lg border border-gray-200 bg-white p-2">
                      <span className="flex items-center justify-center w-6 text-xs opacity-45 flex-shrink-0">
                        ⋮
                      </span>
                      <span className="text-xs opacity-45 flex-shrink-0">{idx + 1}</span>
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) => updateStageName(sec.key, stage.id, e.target.value)}
                        className="flex-1 rounded border-0 bg-transparent text-sm px-1"
                      />
                      <button
                        onClick={() => deleteStage(sec.key, stage.id)}
                        className="text-gray-400 hover:text-red-600 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addStage(sec.key)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add stage
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
