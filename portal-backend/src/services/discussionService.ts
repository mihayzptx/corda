import { v4 as uuidv4 } from 'uuid';
import pool from '../config/database';
import { NotFoundError, ValidationError } from '../middleware/errorHandler';

export interface Message {
  id: string;
  discussion_id: string;
  user_id: string;
  content: string;
  parent_message_id?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  files?: any[];
}

export interface Discussion {
  id: string;
  project_id: string;
  title: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
  unread_count?: number;
}

export async function getDiscussionsByProject(projectId: string): Promise<Discussion[]> {
  const result = await pool.query(
    `SELECT id, project_id, title, created_by, created_at, updated_at,
            (SELECT COUNT(*) FROM messages WHERE discussion_id = discussions.id AND deleted_at IS NULL) as message_count
     FROM discussions WHERE project_id = $1 ORDER BY updated_at DESC`,
    [projectId]
  );

  return result.rows;
}

export async function getDiscussionById(discussionId: string): Promise<Discussion> {
  const result = await pool.query(
    'SELECT id, project_id, title, created_by, created_at, updated_at FROM discussions WHERE id = $1',
    [discussionId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Discussion not found');
  }

  const discussion = result.rows[0];

  const messagesResult = await pool.query(
    `SELECT id, discussion_id, user_id, content, parent_message_id, created_at, updated_at, deleted_at
     FROM messages WHERE discussion_id = $1 AND deleted_at IS NULL ORDER BY created_at ASC`,
    [discussionId]
  );

  discussion.messages = messagesResult.rows;

  return discussion;
}

export async function createDiscussion(projectId: string, title: string, content: string, userId: string): Promise<Discussion> {
  if (!title || title.trim().length === 0) {
    throw new ValidationError('Title is required');
  }

  const discussionId = uuidv4();
  const messageId = uuidv4();

  try {
    await pool.query('BEGIN');

    await pool.query(
      `INSERT INTO discussions (id, project_id, title, created_by) VALUES ($1, $2, $3, $4)`,
      [discussionId, projectId, title, userId]
    );

    if (content && content.trim().length > 0) {
      await pool.query(
        `INSERT INTO messages (id, discussion_id, user_id, content) VALUES ($1, $2, $3, $4)`,
        [messageId, discussionId, userId, content]
      );
    }

    await pool.query('COMMIT');

    return getDiscussionById(discussionId);
  } catch (err) {
    await pool.query('ROLLBACK');
    throw err;
  }
}

export async function addMessageToDiscussion(
  discussionId: string,
  userId: string,
  content: string,
  parentMessageId?: string
): Promise<Message> {
  if (!content || content.trim().length === 0) {
    throw new ValidationError('Message content is required');
  }

  const messageId = uuidv4();

  await pool.query(
    `INSERT INTO messages (id, discussion_id, user_id, content, parent_message_id) VALUES ($1, $2, $3, $4, $5)`,
    [messageId, discussionId, userId, content, parentMessageId || null]
  );

  const result = await pool.query('SELECT * FROM messages WHERE id = $1', [messageId]);

  return result.rows[0];
}

export async function editMessage(messageId: string, content: string, userId: string): Promise<Message> {
  if (!content || content.trim().length === 0) {
    throw new ValidationError('Message content is required');
  }

  const result = await pool.query('SELECT user_id, created_at FROM messages WHERE id = $1', [messageId]);

  if (result.rows.length === 0) {
    throw new NotFoundError('Message not found');
  }

  const message = result.rows[0];

  if (message.user_id !== userId) {
    throw new ValidationError('Only message author can edit');
  }

  const createdTime = new Date(message.created_at).getTime();
  const now = Date.now();
  if (now - createdTime > 5 * 60 * 1000) {
    throw new ValidationError('Can only edit messages within 5 minutes of creation');
  }

  const updateResult = await pool.query(
    'UPDATE messages SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [content, messageId]
  );

  return updateResult.rows[0];
}

export async function deleteMessage(messageId: string, userId: string): Promise<void> {
  const result = await pool.query('SELECT user_id FROM messages WHERE id = $1', [messageId]);

  if (result.rows.length === 0) {
    throw new NotFoundError('Message not found');
  }

  if (result.rows[0].user_id !== userId) {
    throw new ValidationError('Only message author can delete');
  }

  await pool.query('UPDATE messages SET deleted_at = NOW() WHERE id = $1', [messageId]);
}
