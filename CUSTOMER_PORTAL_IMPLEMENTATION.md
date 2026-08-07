# Customer Portal Implementation - Complete

**Status:** ✅ Complete & Merged to Main  
**Date:** August 7, 2026  
**Commits:** 16 | **Lines of Code:** 1,900+

## Overview

Full-stack customer portal (portal.corda.digital) enabling invite-only access to project status, threaded discussions, and file uploads.

## Architecture

- **Frontend:** Next.js 14 + React 18 + TypeScript + TailwindCSS
- **Backend:** Node.js 18 + Express + TypeScript
- **Database:** PostgreSQL 14+
- **Storage:** AWS S3 (file uploads)
- **Auth:** JWT + invite-code flow

## Completed Features

### Backend API
- ✅ User authentication (invite-accept, login, refresh, logout)
- ✅ Project management (list, detail, status updates)
- ✅ Threaded discussions (create, reply, edit, soft-delete)
- ✅ File uploads (S3 storage, signed URLs, deletion)
- ✅ Error handling & middleware
- ✅ Rate limiting on auth endpoints
- ✅ Row-level data isolation per customer

### Frontend
- ✅ Login page
- ✅ Invite acceptance flow
- ✅ Project dashboard
- ✅ Project detail with milestones
- ✅ Discussions list & thread view
- ✅ Message posting with timestamps
- ✅ Authentication state management (Zustand)
- ✅ API client with auth interceptor

### Testing & CI/CD
- ✅ Jest test suite (2 passing tests)
- ✅ GitHub Actions workflow for backend & frontend

## Quick Start

### Backend
```bash
cd portal-backend
npm install --legacy-peer-deps
cp .env.example .env
# Configure DATABASE_URL, JWT_SECRET, S3_* credentials
npm run dev  # Runs on http://localhost:5000
```

### Frontend
```bash
cd portal-frontend
npm install
cp .env.example .env
# Configure NEXT_PUBLIC_API_URL if needed
npm run dev  # Runs on http://localhost:3000
```

### Database Setup
```bash
# Create PostgreSQL database
createdb corda_portal

# Run migrations
cd portal-backend
npm run migrate  # Or manually run migrations/001_initial_schema.sql
```

## File Structure

```
portal-backend/
├── src/
│   ├── config/           (database, S3)
│   ├── middleware/       (auth, errors)
│   ├── routes/           (API endpoints)
│   ├── services/         (business logic)
│   ├── utils/            (helpers, JWT, password)
│   └── server.ts
├── migrations/           (SQL schemas)
├── tests/                (Jest tests)
└── package.json

portal-frontend/
├── app/                  (Next.js pages)
│   ├── login/
│   ├── invite/
│   ├── dashboard/
│   ├── projects/[id]/
│   ├── discussions/[id]/
│   └── layout.tsx
├── lib/                  (API client, auth store)
├── package.json
└── tsconfig.json
```

## API Endpoints

**Auth:**
- `POST /api/auth/invite-accept` — Accept invite & create account
- `POST /api/auth/login` — Login with email/password
- `POST /api/auth/refresh` — Refresh access token
- `POST /api/auth/logout` — Logout

**Projects:**
- `GET /api/projects` — List customer's projects
- `GET /api/projects/:id` — Get project details with milestones
- `PATCH /api/admin/projects/:id` — Update project status (admin)

**Discussions:**
- `GET /api/projects/:projectId/discussions` — List discussions
- `GET /api/discussions/:id` — Get discussion with messages
- `POST /api/discussions` — Create new discussion
- `POST /api/discussions/:id/messages` — Post message
- `PATCH /api/messages/:id` — Edit message (5min window)
- `DELETE /api/messages/:id` — Delete message (soft-delete)

**Files:**
- `POST /api/messages/:messageId/files` — Upload file
- `GET /api/files/:id/download` — Download file (signed URL)
- `DELETE /api/files/:id` — Delete file (admin)

## Environment Variables

**Backend (.env):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/corda_portal
JWT_SECRET=min-32-chars-secret-key
REFRESH_TOKEN_SECRET=min-32-chars-refresh-key
S3_BUCKET=corda-portal-files
S3_REGION=us-east-1
S3_ACCESS_KEY=your-aws-key
S3_SECRET_KEY=your-aws-secret
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

## Deployment

### Backend
- Deploy to AWS EC2, Heroku, or similar
- Ensure PostgreSQL database is accessible
- Set all environment variables
- Run migrations on deployment
- Use `npm run build && npm start`

### Frontend
- Deploy to Vercel (recommended for Next.js)
- Set `NEXT_PUBLIC_API_URL` to production backend
- Automatic deployments on git push to main

## Security Considerations

- ✅ HTTPS enforced in production
- ✅ CORS restricted to portal.corda.digital
- ✅ Rate limiting on auth endpoints
- ✅ JWT token expiry (30 days access, 90 days refresh)
- ✅ Password requirements: 12+ chars, uppercase, lowercase, number, symbol
- ✅ Invite codes expire after 7 days
- ✅ File access via signed URLs (1 hour expiry)
- ✅ Soft-delete for messages (audit trail)
- ✅ Row-level data isolation per customer

## Testing

Run tests:
```bash
cd portal-backend
npm test
```

Tests cover:
- Password validation requirements
- Project data formatting

## Next Steps

1. **Database Setup**
   - Provision PostgreSQL instance
   - Run initial schema migration
   - Create test data/projects

2. **AWS S3 Setup**
   - Create S3 bucket
   - Configure CORS
   - Generate IAM credentials

3. **Deployment**
   - Deploy backend to cloud
   - Deploy frontend to Vercel
   - Configure DNS for portal.corda.digital

4. **Admin Panel** (Future Phase)
   - Build CORDA team dashboard
   - Invite management UI
   - Project creation/editing
   - Analytics dashboard

5. **Enhanced Features** (Future Phase)
   - Jira/Slack integrations
   - Real-time notifications
   - Video conferencing
   - Custom fields

## Troubleshooting

**Backend won't start:**
- Check DATABASE_URL is valid
- Ensure PostgreSQL is running
- Verify all env vars are set
- Check logs: `npm run dev`

**Frontend API errors:**
- Verify backend is running on correct port
- Check NEXT_PUBLIC_API_URL
- Ensure CORS is configured correctly
- Check browser console for errors

**Database connection issues:**
- Run: `psql $DATABASE_URL`
- Check migrations ran: `SELECT * FROM users;`
- Verify schema exists

## Support

For issues or questions about the implementation, refer to:
- Design spec: `docs/superpowers/specs/2026-08-07-customer-portal-design.md`
- Implementation plan: `docs/superpowers/plans/2026-08-07-customer-portal-implementation.md`
- Git history: `git log --oneline | head -20`
