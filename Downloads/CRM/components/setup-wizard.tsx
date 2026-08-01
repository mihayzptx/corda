'use client';

import React, { useState, useEffect } from 'react';
import { SetupState, loadSetupState, saveSetupState, clearSetupState } from '@/lib/setup-state';
import { Step0Company } from './setup/step0-company';
import { Step1Items } from './setup/step1-items';
import { Step2Pipeline } from './setup/step2-pipeline';
import { Step3Workflow } from './setup/step3-workflow';
import { Step4Dashboards } from './setup/step4-dashboards';
import { FinishScreen } from './setup/finish-screen';

const STEP_LABELS = ['General info', 'Set up items', 'Set up pipeline', 'Set up workflow', 'Dashboards & notifications'];

export function SetupWizard() {
  const [state, setState] = useState<SetupState | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loaded = loadSetupState();
    if (loaded) {
      setState(loaded);
    } else {
      setState(getInitialState());
    }
    setMounted(true);
  }, []);

  if (!mounted || !state) return null;

  const updateState = (updates: Partial<SetupState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    saveSetupState(newState);
  };

  const onCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState({ company: { ...state.company, name: e.target.value } });
  };

  const onIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateState({ company: { ...state.company, industry: e.target.value } });
  };

  const setTeamSize = (size: string) => {
    updateState({ company: { ...state.company, teamSize: size } });
  };

  const continueDisabled = state.step === 0 && !(state.company.name.trim() && state.company.industry && state.company.teamSize);

  const onContinue = () => {
    if (state.step < 4) {
      updateState({ step: state.step + 1 });
    } else {
      updateState({ finished: true });
    }
  };

  const onBack = () => {
    if (state.step > 0) {
      updateState({ step: state.step - 1 });
    }
  };

  const onRestart = () => {
    clearSetupState();
    setState(getInitialState());
  };

  if (state.finished) {
    return <FinishScreen state={state} onRestart={onRestart} />;
  }

  const stepLabels = STEP_LABELS[state.step];

  return (
    <div className="space-y-6">
      <header className="border-b pb-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-semibold text-base">Setup</div>
          <div className="text-xs text-gray-500">Step {state.step + 1} of 5 — {stepLabels}</div>
        </div>
        <div className="flex items-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded text-xs font-semibold ${
                  i < state.step
                    ? 'bg-blue-100 border border-blue-600 text-blue-800'
                    : i === state.step
                    ? 'bg-blue-600 border border-blue-600 text-white'
                    : 'bg-transparent border border-gray-300 text-gray-500'
                }`}
              >
                {i < state.step ? '✓' : i + 1}
              </div>
              {i < 4 && (
                <div className={`flex-1 h-0.5 ${i < state.step ? 'bg-blue-600' : 'bg-gray-300'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

      <main>
        {state.step === 0 && (
          <Step0Company
            company={state.company}
            onCompanyNameChange={onCompanyNameChange}
            onIndustryChange={onIndustryChange}
            setTeamSize={setTeamSize}
            onContinue={onContinue}
            continueDisabled={continueDisabled}
          />
        )}
        {state.step === 1 && <Step1Items state={state} updateState={updateState} />}
        {state.step === 2 && <Step2Pipeline state={state} updateState={updateState} />}
        {state.step === 3 && <Step3Workflow state={state} updateState={updateState} />}
        {state.step === 4 && <Step4Dashboards state={state} updateState={updateState} />}
      </main>

      <footer className="border-t pt-4 flex items-center justify-between">
        {state.step > 0 ? (
          <button onClick={onBack} className="text-sm text-gray-600 hover:text-gray-900">
            ← Back
          </button>
        ) : (
          <span></span>
        )}
        <button
          onClick={onContinue}
          disabled={continueDisabled}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {state.step === 4 ? 'Finish setup' : 'Continue'} →
        </button>
      </footer>
    </div>
  );
}

function getInitialState(): SetupState {
  return {
    step: 0,
    finished: false,
    company: { name: '', industry: '', teamSize: '' },
    items: [
      { id: 'contacts', name: 'Contacts', desc: 'People you\'re in touch with — clients, tenants, and vendors.', enabled: true, custom: false, needsPipeline: false },
      { id: 'companies', name: 'Companies', desc: 'Organizations you do business with, grouped by account.', enabled: true, custom: false, needsPipeline: false },
      { id: 'deals', name: 'Deals', desc: 'Active jobs and opportunities moving through your pipeline.', enabled: true, custom: false, needsPipeline: true },
    ],
    showAddItem: false,
    newItemName: '',
    newItemPipeline: false,
    pipelineOrder: [],
    pipelines: {},
    workflow: { loading: false, error: false, rules: [] },
    showAddRule: false,
    newRuleName: '',
    newRuleDesc: '',
    dashboards: { loading: false, error: false, views: [] },
    showAddView: false,
    newViewName: '',
    newViewDesc: '',
  };
}
