'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import client from '@/lib/api-client';
import { useAuthStore } from '@/lib/store';

interface Project {
  id: string;
  name: string;
  phase: string;
  completion_percent: number;
  start_date?: string;
  estimated_end_date?: string;
}

const PHASE_COLORS: Record<string, string> = {
  'Discovery': 'bg-blue-100 text-blue-800',
  'Development': 'bg-purple-100 text-purple-800',
  'QA': 'bg-orange-100 text-orange-800',
  'Delivery': 'bg-yellow-100 text-yellow-800',
  'Complete': 'bg-green-100 text-green-800',
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await client.get('/projects');
        setProjects(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CORDA Portal</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">My Projects</h2>

        {error && <div className="p-4 bg-red-100 text-red-800 rounded mb-8">{error}</div>}

        {projects.length === 0 ? (
          <p className="text-gray-600">No active projects</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer bg-white">
                  <h3 className="text-lg font-semibold mb-4">{project.name}</h3>

                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-sm px-3 py-1 rounded-full ${PHASE_COLORS[project.phase] || 'bg-gray-100 text-gray-800'}`}>
                      {project.phase}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{project.completion_percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: `${project.completion_percent}%` }}
                      ></div>
                    </div>
                  </div>

                  {project.start_date && project.estimated_end_date && (
                    <div className="text-sm text-gray-600">
                      <p>{project.start_date} → {project.estimated_end_date}</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
