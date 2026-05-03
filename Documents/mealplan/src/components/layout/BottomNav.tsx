'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/workout/today', label: 'Workout', icon: '💪' },
  { path: '/nutrition/today', label: 'Nutrition', icon: '🥗' },
  { path: '/progress', label: 'Progress', icon: '📈' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav({ currentPath }: { currentPath?: string }) {
  const pathname = usePathname();
  const active = currentPath || pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center h-20">
      {navItems.map((item) => {
        const isActive = active === item.path || active.startsWith(item.path.split('/')[1]);
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center w-16 h-20 text-xs gap-1 transition-colors ${
              isActive
                ? 'text-orange-500 border-t-2 border-orange-500'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
