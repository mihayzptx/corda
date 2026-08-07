# Customer Portal Design

> **Date:** August 7, 2026  
> **Scope:** Design and specify an invite-only customer portal for CORDA project stakeholders

## Goal

Build a separate web application (portal.corda.digital) where CORDA clients can access project information, communicate with the team via threaded discussions, upload files, and track project status in real-time.

## Problem Statement

CORDA's clients currently lack a centralized, professional space to:
- Stay informed on project progress without constant email chains
- Share files securely with the team
- View timelines, milestones, and completion status
- Maintain organized communication history by project

This portal solves that by providing a purpose-built client workspace that complements (not replaces) existing tools like Jira and Slack.

---

## Architecture Overview

**System Design:** Full-stack web application with separate frontend and backend

**Tech Stack:**
- **Frontend:** Next.js 14+ with React 18+, TypeScript, TailwindCSS
- **Backend:** Node.js 18+ with Express, TypeScript
- **Database:** PostgreSQL 14+
- **File Storage:** AWS S3 or S3-compatible (MinIO, DigitalOcean Spaces)
- **Authentication:** JWT (access + refresh tokens)
- **Deployment:** Vercel (frontend), cloud provider of choice (backend)
- **Domain:** portal.corda.digital (separate from main corda.digital)

**Design Principles:**
1. **Invite-only:** No self-registration; CORDA controls access
2. **Read-mostly for customers:** Customers view projects, participate in discussions; CORDA team manages project data
3. **Future-proof APIs:** Backend designed for Jira, Slack, and custom integrations (Phase 2)
4. **Security-first:** Data isolation per customer, encrypted file storage, audit logging
5. **Professional UX:** Consistent with CORDA's design language (gold accents, clean typography)

---

## Core Data Model

### Users

```
id (UUID)
email (string, unique)
password_hash (string)
full_name (string)
company_name (string)
role (enum: 'customer' | 'corda_admin')
created_at (timestamp)
last_login (timestamp)
```

### Projects

```
id (UUID)
customer_id (UUID, FK to Users)
name (string)
description (text)
phase (enum: 'Discovery' | 'Development' | 'QA' | 'Delivery' | 'Complete')
completion_percent (int: 0-100)
start_date (date)
estimated_end_date (date)
created_at (timestamp)
updated_at (timestamp)
```

### Discussions

```
id (UUID)
project_id (UUID, FK to Projects)
title (string)
created_by (UUID, FK to Users)
created_at (timestamp)
updated_at (timestamp)
```

### Messages

```
id (UUID)
discussion_id (UUID, FK to Discussions)
user_id (UUID, FK to Users)
content (text, markdown)
parent_message_id (UUID, nullable, FK to Messages — for replies)
created_at (timestamp)
updated_at (timestamp)
deleted_at (timestamp, nullable — soft delete)
```

### Files

```
id (UUID)
message_id (UUID, FK to Messages)
filename (string, original name)
file_path (string, S3 key)
file_size (bigint, bytes)
file_type (string, MIME type)
uploaded_by (UUID, FK to Users)
created_at (timestamp)
expires_at (timestamp, nullable)
```

### Invites

```
id (UUID)
email (string)
code (string, unique, short and URL-safe)
project_id (UUID, FK to Projects)
created_by (UUID, FK to Users — CORDA admin who sent invite)
used (boolean, default false)
used_by (UUID, nullable, FK to Users)
created_at (timestamp)
expires_at (timestamp, default +7 days)
```

### Milestones

```
id (UUID)
project_id (UUID, FK to Projects)
title (string)
target_date (date)
status (enum: 'not_started' | 'in_progress' | 'complete')
description (text, optional)
created_at (timestamp)
updated_at (timestamp)
```

---

## Authentication & Authorization

### Invitation Flow

1. **CORDA Admin Action:** Admin logs into internal admin panel, selects a project, enters customer email
2. **Invite Generation:** System creates unique invite code (8-12 characters, alphanumeric, URL-safe) and expires in 7 days
3. **Email Sent:** Customer receives email: "You've been invited to project [name]. Accept here: portal.corda.digital/invite?code=ABC123XYZ"
4. **Customer Signup:** Customer clicks link, sees pre-filled email, creates password, submits
5. **Account Creation:** System creates user account, marks invite as used, generates JWT token
6. **Redirect:** Customer redirected to project dashboard

### Session Management

- **JWT Token:** Issued on login/signup, stored in secure httpOnly cookie
- **Access Token:** 30-day expiry
- **Refresh Token:** 90-day expiry (allows extending session without re-login)
- **Auto-logout:** After 7 days of inactivity
- **Remember Me:** Optional checkbox extends session to 90 days of inactivity

### Permission Model

- **Customers:** Can view only their assigned projects, view all discussions for their projects, post messages, upload files
- **CORDA Admins:** Can view all projects, manage project data, create discussions, update statuses
- **Data Isolation:** Customers cannot see other customers' data; implemented via SQL row-level security where possible
- **File Access:** Inherited from parent discussion/project; signed URLs with time-limited access

### Security

- HTTPS enforced (HTTP redirects to HTTPS)
- CORS restricted to portal.corda.digital domain
- Rate limiting: 5 login attempts per email per 15 minutes
- Rate limiting: 50 invites per admin per day
- Invite codes expire after 7 days
- Passwords minimum 12 characters, must include uppercase, lowercase, number, symbol
- Sensitive endpoints require re-authentication (password change, logout all devices)

---

## Frontend Architecture

### Pages

#### 1. Login Page (`/login`)
- Email + password form
- "Forgot password" link (password reset flow)
- Display: "Don't have an account? Accept an invite to get started"
- Redirect to dashboard on success

#### 2. Invite Acceptance Page (`/invite?code=ABC123`)
- Validate invite code and show project name
- If already logged in and code is valid, auto-accept and redirect to project
- If not logged in, show: "You've been invited to [Project Name]. Create your account:"
- Email field pre-filled
- Password creation form
- "Accept Invitation" button

#### 3. Dashboard (`/dashboard`)
- Header: CORDA logo (links to corda.digital), user dropdown (settings, logout)
- Main content: "My Projects" heading
- Grid of project cards (4 columns on desktop, 2 on tablet, 1 on mobile)
- Each card shows:
  - Project name (link to project detail)
  - Current phase (colored badge)
  - Completion progress bar
  - Start date → Estimated end date (timeline text)
  - "View Project" button

#### 4. Project Detail Page (`/projects/[id]`)
- Header: Project name, phase badge, completion %, timeline
- Tabs: Overview | Discussions | Files
- **Overview Tab:**
  - Status summary (last updated timestamp)
  - Milestones section (checklist of milestones with target dates and status)
  - Key metrics (if available from integrations)
- **Discussions Tab:**
  - List of all discussion threads for this project
  - "New Message" quick-action (starts new discussion thread)
  - Each thread shows: title, number of unread messages, last message preview, last updated
- **Files Tab:**
  - All files uploaded to this project organized by discussion thread
  - Search/filter by date range, filename
  - Download individual files or bulk zip

#### 5. Discussion Thread View (`/projects/[id]/discussions/[id]`)
- Header: Discussion title, created date
- Chronological message list (newest at bottom)
- Each message shows: sender name, timestamp, message content, attached files
- Attached files show: filename, file icon/thumbnail, download link
- Message compose box at bottom with:
  - Text input (markdown support: bold, italic, code, links)
  - Attach file button (drag-and-drop + click-to-upload)
  - Send button
- Messages can be edited by author (within 5 minutes of creation)
- Deleted messages show "[deleted message]" placeholder

#### 6. Account Settings Page (`/settings`)
- Profile: Name, email (read-only), company
- Security: Change password, password strength indicator
- Notifications: Email digest preferences (future phase)
- Sessions: List active sessions, "logout all devices" button
- Delete Account (with confirmation)

### Navigation

- **Top Nav:** CORDA logo, project dropdown (list of user's projects with quick navigation), user menu (settings, logout)
- **Responsive:** Hamburger menu on mobile (< 768px)
- **Breadcrumb:** Show current location (Dashboard > Project Name > Discussion Title)

### Design Language

- **Colors:** Use CORDA's existing palette (var(--gold), var(--text), var(--s1), var(--border), etc.)
- **Typography:** Match main CORDA site (Bricolage Grotesque for headings, Outfit for body)
- **Spacing:** 16px, 24px, 32px, 48px baseline
- **Buttons:** Primary (gold background), secondary (bordered), danger (red)
- **Cards:** Subtle border, light background (var(--s1)), hover lift effect
- **Status Badges:** Color-coded phases (Discovery = blue, Development = purple, QA = orange, Delivery = gold, Complete = green)

---

## Backend API

### Authentication Endpoints

```
POST /api/auth/invite-accept
  Body: { code: string, email: string, password: string }
  Response: { token: string, user: User }

POST /api/auth/login
  Body: { email: string, password: string }
  Response: { access_token: string, refresh_token: string, user: User }

POST /api/auth/refresh
  Body: { refresh_token: string }
  Response: { access_token: string }

POST /api/auth/logout
  Headers: Authorization: Bearer <token>
  Response: { success: boolean }

POST /api/auth/logout-all-devices
  Headers: Authorization: Bearer <token>
  Response: { success: boolean }

POST /api/auth/change-password
  Headers: Authorization: Bearer <token>
  Body: { current_password: string, new_password: string }
  Response: { success: boolean }

POST /api/auth/request-password-reset
  Body: { email: string }
  Response: { success: boolean, message: "Check your email" }

POST /api/auth/reset-password
  Body: { token: string, new_password: string }
  Response: { success: boolean }
```

### Project Endpoints

```
GET /api/projects
  Headers: Authorization: Bearer <token>
  Response: [ { id, name, phase, completion_percent, start_date, estimated_end_date, milestones: [...] } ]

GET /api/projects/:id
  Headers: Authorization: Bearer <token>
  Response: { id, name, description, phase, completion_percent, start_date, estimated_end_date, milestones: [...], status_summary, last_updated }

GET /api/projects/:id/milestones
  Headers: Authorization: Bearer <token>
  Response: [ { id, title, target_date, status, description } ]
```

### Discussion Endpoints

```
GET /api/projects/:id/discussions
  Headers: Authorization: Bearer <token>
  Response: [ { id, title, created_by, created_at, message_count, last_message_preview, unread_count } ]

POST /api/discussions
  Headers: Authorization: Bearer <token>
  Body: { project_id: string, title: string, content: string }
  Response: { id, title, messages: [{ id, content, user_id, created_at }] }

GET /api/discussions/:id
  Headers: Authorization: Bearer <token>
  Response: { id, title, project_id, messages: [ { id, user_id, content, created_at, files: [...] } ] }
```

### Message Endpoints

```
POST /api/discussions/:id/messages
  Headers: Authorization: Bearer <token>
  Body: { content: string, parent_message_id?: string }
  Response: { id, content, user_id, created_at, files: [] }

PATCH /api/messages/:id
  Headers: Authorization: Bearer <token>
  Body: { content: string }
  Response: { id, content, updated_at }

DELETE /api/messages/:id
  Headers: Authorization: Bearer <token>
  Response: { success: boolean, deleted_at }
```

### File Endpoints

```
POST /api/messages/:id/files
  Headers: Authorization: Bearer <token>, Content-Type: multipart/form-data
  Body: FormData { file: File }
  Response: { id, filename, file_size, file_type, uploaded_by, created_at, download_url }

GET /api/files/:id/download
  Headers: Authorization: Bearer <token>
  Response: 302 redirect to signed S3 URL (expires in 1 hour)

DELETE /api/files/:id
  Headers: Authorization: Bearer <token> (only CORDA admins)
  Response: { success: boolean }
```

### Admin Endpoints (CORDA team only)

```
POST /api/admin/invites
  Headers: Authorization: Bearer <token>
  Body: { email: string, project_id: string }
  Response: { id, code, email, expires_at }

PATCH /api/admin/projects/:id
  Headers: Authorization: Bearer <token>
  Body: { phase?: string, completion_percent?: int, status_summary?: string }
  Response: { id, phase, completion_percent, status_summary, updated_at }

PATCH /api/admin/projects/:id/milestones/:milestone_id
  Headers: Authorization: Bearer <token>
  Body: { status: string }
  Response: { id, status, updated_at }
```

### Error Responses

All errors follow standard format:
```json
{
  "error": "error_code",
  "message": "Human-readable message",
  "status": 400
}
```

Common errors:
- `unauthorized` (401): No valid token
- `forbidden` (403): User lacks permission
- `not_found` (404): Resource doesn't exist
- `validation_error` (400): Invalid input
- `invite_expired` (400): Invite code has expired
- `file_too_large` (413): File exceeds size limit
- `rate_limit_exceeded` (429): Too many requests

---

## File Upload & Storage

### Upload Flow

1. Customer selects file via drag-and-drop or file picker
2. Client validates: file type, size (max 100MB)
3. Shows progress indicator during upload
4. Server generates unique filename: `{project_id}/{uuid}-{original_extension}`
5. Uploads to S3 with metadata (original filename, MIME type, uploader ID)
6. Returns signed download URL (valid for 1 hour)
7. File reference stored in database, linked to message
8. On message send, file becomes persistent

### Supported Types

- **Images:** JPG, PNG, GIF, WebP
- **Documents:** PDF, DOCX, XLSX, PPTX, TXT
- **Video:** MP4, MOV, WebM
- **Archives:** ZIP (Phase 2)
- **Others:** SVG, JSON

### Size & Storage Limits

- Single file max: 100MB
- Project total: 5GB (soft limit, CORDA can increase per contract)
- Monthly per-project: 50GB upload limit
- Auto-delete: Files not referenced in any message after 30 days are deleted

### Security

- Virus scanning on upload (ClamAV, Phase 2)
- Files stored with access control (can only be downloaded by authorized users)
- Signed URLs expire after 1 hour
- Audit trail: log file downloads (who, when, from which project)
- Encryption at rest (S3 default encryption)

### Versioning (Future)

- Store multiple versions of files with same name
- Allow rollback to previous versions (Phase 2)

---

## Messaging & Discussions

### Discussion Threads

- Each project can have multiple discussion threads (e.g., "Status Updates", "Technical Questions", "Deliverables")
- CORDA team creates threads; customers can only reply
- Threads are permanent (no deletion, only archiving in Phase 2)
- Thread title visible to all project members

### Messages

- Support markdown: `**bold**`, `*italic*`, `` `code` ``, `[links](url)`, code blocks with triple backticks
- Auto-linkify URLs
- Mentions: @username notifies that user (Phase 2)
- Reactions/emojis (Phase 2)
- Editing: Users can edit own messages within 5 minutes of creation; shows "[edited]" label
- Deletion: Soft-delete (message text replaced with "[deleted message]"), message ID preserved to maintain thread integrity

### Notifications (MVP)

- **In-app:** Unread message badge on project card and discussion list
- **Email (CORDA team):** Real-time notification when customer posts a message
- **Email (Customers):** Daily digest of new CORDA team replies (opt-in, Phase 2)

### Notification Preferences (Phase 2)

- Email digest frequency: immediate, daily, weekly, off
- Notify on: new discussions, replies to my messages, all messages
- Quiet hours (no notifications between X and Y)

---

## Integration Points (Future Phases)

### Phase 2: Jira Integration

- Pull project status, phase, completion % from Jira board
- Sync milestones with Jira epics/releases
- Customer portal reads from Jira as source of truth
- Webhook: Jira updates → portal updates in real-time

### Phase 2: Slack Integration

- Notify CORDA team in Slack when customer posts a message
- Post project milestone updates to shared Slack channels
- Allow CORDA to reply to discussions via Slack (optional)

### Phase 2: Custom Webhooks

- Customers can provide webhook URLs for milestone updates
- Portal sends POST to webhook with project status changes
- Allows customer to integrate into their own tools

### Phase 3: OAuth2 Integration

- Support single sign-on (SSO) via customers' own identity providers
- SAML 2.0 support for enterprise customers

---

## Success Criteria

- ✅ Invite-only access with secure invite code generation
- ✅ Professional login/signup flow
- ✅ Dashboard showing all customer's active projects with status at a glance
- ✅ Project detail page with timeline, completion %, phase, milestones
- ✅ Threaded discussions with full message history
- ✅ File uploads as message attachments with download capability
- ✅ Real-time message updates (or near-real-time with polling)
- ✅ Mobile-responsive design matching CORDA brand
- ✅ Secure file storage with access control
- ✅ Audit logging of file downloads and sensitive actions
- ✅ API design supports future Jira/Slack integrations
- ✅ Zero data leakage between customers (row-level security)
- ✅ Handle concurrent edits to project status (last-write-wins)
- ✅ Graceful offline handling (PWA-ready in Phase 2)

---

## Out of Scope (Phase 2+)

- Video conferencing/screen sharing
- Project creation by customers
- Custom fields/metadata
- Approval workflows
- Time tracking
- Gantt charts
- Budget tracking
- Client-to-client collaboration
- White-labeling
- Multi-language support
- Mobile native apps

---

## Deployment & Operations

### Environment Setup

- **Development:** Local PostgreSQL, MinIO for S3-compat storage, Next.js dev server
- **Staging:** Heroku/cloud provider, managed PostgreSQL, AWS S3, Vercel preview deployments
- **Production:** Cloud provider (AWS/GCP/Azure), managed PostgreSQL (RDS/Cloud SQL), AWS S3, Vercel production

### Monitoring

- Error tracking: Sentry
- Analytics: Posthog (usage patterns, feature adoption)
- Performance: Vercel Analytics, CloudWatch logs
- Uptime monitoring: Pingdom or similar

### Backups

- Daily automated PostgreSQL backups (7-day retention)
- S3 versioning enabled for file recovery
- Disaster recovery plan: RTO 1 hour, RPO 15 minutes

### Security

- Network: WAF on API, DDoS protection
- Database: SSL connections, encrypted passwords (bcrypt)
- Secrets: Environment variables via managed secrets service (AWS Secrets Manager, etc.)
- Code: Static analysis (ESLint, TypeScript strict), dependency scanning
- Compliance: GDPR-ready (data export, deletion, consent tracking)

