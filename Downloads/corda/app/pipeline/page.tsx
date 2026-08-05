'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
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
    <div className="page-container">
      <Header companyName={companyName} currentPage="pipeline" />

      <main className="page-content">
        <h1 className="section-title">Deals</h1>
        <PipelineBoard initialStages={stages} initialDeals={deals} />
      </main>
    </div>
  );
}
