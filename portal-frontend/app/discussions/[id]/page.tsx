'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import client from '@/lib/api-client';

interface Message {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
}

interface Discussion {
  id: string;
  project_id: string;
  title: string;
  messages?: Message[];
}

export default function DiscussionPage() {
  const params = useParams();
  const discussionId = params.id as string;
  const router = useRouter();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchDiscussion = async () => {
      try {
        const response = await client.get(`/discussions/${discussionId}`);
        setDiscussion(response.data);
      } catch (err) {
        console.error('Failed to load discussion');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussion();
  }, [discussionId, router]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !discussion) return;

    try {
      const response = await client.post(`/discussions/${discussionId}/messages`, {
        content: messageContent,
      });

      setDiscussion({
        ...discussion,
        messages: [...(discussion.messages || []), response.data],
      });
      setMessageContent('');
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!discussion) return <div className="p-8">Discussion not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-2xl mx-auto px-8 py-4">
          <Link href={`/projects/${discussion.project_id}/discussions`} className="text-blue-600 hover:text-blue-800">
            ← Back to Discussions
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">{discussion.title}</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {(discussion.messages || []).map((msg) => (
              <div key={msg.id} className="p-3 bg-gray-50 rounded">
                <p className="text-sm text-gray-600">{new Date(msg.created_at).toLocaleString()}</p>
                <p className="mt-1">{msg.content}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="space-y-2 border-t pt-4">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={3}
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
