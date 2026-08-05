'use client';

import { Header } from '@/components/header';
import { SetupWizard } from '@/components/setup-wizard';

export default function SetupPage() {
  return (
    <div className="page-container">
      <Header currentPage="setup" />
      <div className="setup-container">
        <SetupWizard />
      </div>
    </div>
  );
}
