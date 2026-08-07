'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import client from '@/lib/api-client';

interface Discussion {
  id: string;
  title: string;
  message_count?: number;
  created_at: string;
}

export default function DiscussionsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const router = useRouter();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDiscussions = async () => {
      try {
        const response = await client.get(`/projects/${projectId}/discussions`);
        setDiscussions(response.data);
      } catch (err) {
        console.error('Failed to load discussions');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, [projectId, router]);

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Link href={`/projects/${projectId}`} className="text-blue-600 hover:text-blue-800">
            ← Back to Project
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-3xl font-bold mb-8">Discussions</h2>

        {discussions.length === 0 ? (
          <p className="text-gray-600">No discussions yet</p>
        ) : (
          <div className="space-y-2">
            {discussions.map((discussion) => (
              <Link key={discussion.id} href={`/discussions/${discussion.id}`}>
                <div className="p-4 border border-gray-200 rounded hover:shadow-md cursor-pointer bg-white">
                  <h3 className="font-semibold">{discussion.title}</h3>
                  <p className="text-sm text-gray-600">{discussion.message_count || 0} messages</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
