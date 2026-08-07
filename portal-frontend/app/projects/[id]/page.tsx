'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import client from '@/lib/api-client';

interface Milestone {
  id: string;
  title: string;
  target_date?: string;
  status: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  phase: string;
  completion_percent: number;
  start_date?: string;
  estimated_end_date?: string;
  milestones?: Milestone[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchProject = async () => {
      try {
        const response = await client.get(`/projects/${projectId}`);
        setProject(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  return (
    <div className="min-h-screen bg-light">
      <nav>
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Link href="/dashboard">← Back to Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        {project.description && <p className="text-muted mb-6">{project.description}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 card">
            <p className="text-sm text-muted">Phase</p>
            <p className="text-xl font-semibold">{project.phase}</p>
          </div>
          <div className="p-4 card">
            <p className="text-sm text-muted">Completion</p>
            <p className="text-xl font-semibold">{project.completion_percent}%</p>
          </div>
          <div className="p-4 card">
            <p className="text-sm text-muted">Timeline</p>
            <p className="text-sm">{project.start_date} → {project.estimated_end_date}</p>
          </div>
        </div>

        {project.milestones && project.milestones.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Milestones</h2>
            <div className="space-y-2 card p-6">
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-3 p-3 border-b last:border-b-0">
                  <input
                    type="checkbox"
                    checked={milestone.status === 'complete'}
                    readOnly
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-gray-600">{milestone.target_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
