'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  companyName?: string;
  currentPage?: 'dashboard' | 'pipeline' | 'setup';
}

export function Header({ companyName = 'Your CRM', currentPage }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-bold text-lg text-gray-900">{companyName}</div>
          <nav className="hidden sm:flex gap-6">
            <Link
              href="/pipeline"
              className={`text-sm font-medium transition-colors ${
                currentPage === 'pipeline'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Deals
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                currentPage === 'dashboard'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </Link>
          </nav>
        </div>
        <nav className="sm:hidden flex gap-4">
          <Link
            href="/pipeline"
            className={`text-sm font-medium ${
              currentPage === 'pipeline' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Deals
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-medium ${
              currentPage === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}
