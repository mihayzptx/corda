'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">{companyName}</div>
          <nav className="flex gap-4 text-sm">
            <a href="/pipeline" className="text-gray-600 hover:text-gray-900">
              Deals
            </a>
            <a href="/dashboard" className="font-semibold text-gray-900">
              Dashboard
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold mb-1">Dashboards</h2>
        <p className="text-sm text-gray-600 mb-6">Work views your team checks daily.</p>
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
