export interface CompanyInfo {
  name: string;
  industry: string;
  teamSize: string;
}

export interface Item {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  custom: boolean;
  needsPipeline: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
}

export interface WorkflowRule {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
}

export interface DashboardView {
  id: string;
  name: string;
  desc: string;
  enabled: boolean;
  notify: boolean;
}

export interface SetupState {
  step: number;
  finished: boolean;
  company: CompanyInfo;
  items: Item[];
  showAddItem: boolean;
  newItemName: string;
  newItemPipeline: boolean;
  pipelineOrder: string[];
  pipelines: Record<string, { loading: boolean; error: boolean; stages: PipelineStage[] }>;
  workflow: { loading: boolean; error: boolean; rules: WorkflowRule[] };
  showAddRule: boolean;
  newRuleName: string;
  newRuleDesc: string;
  dashboards: { loading: boolean; error: boolean; views: DashboardView[] };
  showAddView: boolean;
  newViewName: string;
  newViewDesc: string;
}

export function loadSetupState(): SetupState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('crmSetupHandoff');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSetupState(state: Partial<SetupState>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = loadSetupState() || {};
    localStorage.setItem('crmSetupHandoff', JSON.stringify({ ...existing, ...state }));
  } catch (e) {}
}

export function clearSetupState(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem('crmSetupHandoff');
    localStorage.removeItem('crmGuidedDone');
  } catch (e) {}
}
