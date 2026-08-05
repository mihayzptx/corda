'use client';

import React from 'react';

interface DashboardView {
  name: string;
  desc: string;
  count?: number;
}

interface DashboardGridProps {
  views: DashboardView[];
}

export function DashboardGrid({ views }: DashboardGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {views.map((view, idx) => (
        <div key={idx} className="card cursor-pointer">
          <div className="text-xs text-gray-500 mb-1">View</div>
          <div className="font-semibold text-sm mb-1">{view.name}</div>
          <p className="text-sm text-gray-600 mb-3">{view.desc}</p>
          <div className="text-xs text-gray-500">
            {view.count !== undefined ? `${view.count} matching deals` : '—'}
          </div>
        </div>
      ))}
    </div>
  );
}
