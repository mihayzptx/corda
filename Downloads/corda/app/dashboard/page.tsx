'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { DashboardGrid } from '@/components/dashboard-grid';

interface DashboardView {
  name: string;
  desc: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [views, setViews] = useState<DashboardView[]>([]);
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
    setViews(
      setup.dashboardViews || [
        { name: 'My open deals', desc: 'Deals you own that haven\'t closed yet, grouped by stage.' },
        { name: 'Stale deals', desc: 'No activity in 14+ days — needs a follow-up.' },
      ]
    );
    setMounted(true);
  }, [router]);

  if (!mounted) return null;

  return (
    <div className="page-container">
      <Header companyName={companyName} currentPage="dashboard" />

      <main className="page-content">
        <h1 className="section-title">Dashboards</h1>
        <p className="section-subtitle">Work views your team checks daily.</p>
        <DashboardGrid
          views={views.map((v) => ({
            ...v,
            count: Math.floor(Math.random() * 6),
          }))}
        />
      </main>
    </div>
  );
}
