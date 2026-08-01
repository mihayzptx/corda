'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PipelineBoard } from '@/components/pipeline-board';

interface Stage {
  id: string;
  name: string;
}

interface Deal {
  id: string;
  name: string;
  value?: string;
  stageId: string;
}

export default function PipelinePage() {
  const router = useRouter();
  const [stages, setStages] = useState<Stage[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companyName, setCompanyName] = useState('Your CRM');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const setupData = localStorage.getItem('crmSetupHandoff');
    if (!setupData) {
      router.push('/setup');
      return;
    }

    const setup = JSON.parse(setupData);
    setCompanyName(setup.companyName || 'Your CRM');

    const defaultStages = setup.stages || [
      'New Lead',
      'Quote Sent',
      'Scheduled',
      'In Progress',
      'Invoiced',
      'Paid',
    ];

    setStages(
      defaultStages.map((name: string, idx: number) => ({
        id: `stage-${idx}`,
        name,
      }))
    );
    setMounted(true);
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">{companyName}</div>
          <nav className="flex gap-4 text-sm">
            <a href="/pipeline" className="font-semibold text-gray-900">
              Deals
            </a>
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-6">Deals</h2>
        <PipelineBoard initialStages={stages} initialDeals={deals} />
      </main>
    </div>
  );
}
