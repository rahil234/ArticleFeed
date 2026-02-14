# Publish Feature Implementation

## Overview
This document describes the implementation of the article publish/unpublish feature and making public pages truly public (accessible without authentication).

## Changes Made

### 1. Database Schema
- Added `status` field (enum: DRAFT, PUBLISHED) with default value DRAFT
- Added `publishedAt` timestamp field to track when an article was published
- Migration file: `20260213223318_add_publish_status/migration.sql`

### 2. Backend API Changes

#### Article Entity (`backend/src/article/entities/article.entity.ts`)
- Added `status: PublishStatus` field
- Added `publishedAt: Date | null` field

#### Article Repository (`backend/src/article/repositories/prisma-article.repository.ts`)
- Updated `findAll()` to only return PUBLISHED articles, ordered by `publishedAt`
- Updated `findByCategory()` to only return PUBLISHED articles (for user feed)
- Added `publish(id: string, userId: string)` method
- Added `unpublish(id: string, userId: string)` method

#### Article Service (`backend/src/article/services/article.service.impl.ts`)
- Added `publish(id: string, userId: string)` method
- Added `unpublish(id: string, userId: string)` method

#### Article Controller (`backend/src/article/controllers/article.controller.ts`)
- Added `POST /api/article/:id/publish` endpoint (requires authentication)
- Added `POST /api/article/:id/unpublish` endpoint (requires authentication)

#### DTOs
- Updated `ArticleResponseDto` to include `status` and `publishedAt` fields

#### Middleware Configuration (`backend/src/article/article.module.ts`)
- Public endpoints (no authentication required):
  - `GET /api/article/public` - Get all published articles
  - `GET /api/article/public/:id` - Get a specific published article

### 3. Frontend Changes

#### Types (`frontend/src/lib/types.ts`)
- Added `status: 'DRAFT' | 'PUBLISHED'` to Article interface
- Added `publishedAt: string | null` to Article interface

#### Article Service (`frontend/src/services/article.service.ts`)
- Added `publish(id: string)` method
- Added `unpublish(id: string)` method

#### My Articles Page (`frontend/src/app/articles/my-articles/page.tsx`)
- Added status badge showing "✓ Published" (green) or "○ Draft" (outlined)
- Added publish/unpublish button with appropriate icons
- Publish button publishes draft articles
- Unpublish button converts published articles back to drafts
- Loading state while publishing/unpublishing
- Toast notifications for success/error states

#### Home Page (`frontend/src/app/page.tsx`)
- Already configured to show public articles without authentication
- Non-authenticated users can view all published articles

## How It Works

### Article Lifecycle
1. **Create**: Articles are created with status = DRAFT by default
2. **Draft**: Author can edit the article, not visible to public
3. **Publish**: Author clicks "Publish" button → status = PUBLISHED, publishedAt = current timestamp
4. **Public**: Article appears in public feed and on home page
5. **Unpublish**: Author clicks "Unpublish" button → status = DRAFT, publishedAt = null

### Public Access
- Home page (`/`) shows all published articles to non-authenticated users
- Public API endpoints (`/api/article/public` and `/api/article/public/:id`) don't require authentication
- Only PUBLISHED articles are returned in public queries
- User feed only shows published articles from other users

### Author Access
- Authors can see all their own articles (both DRAFT and PUBLISHED)
- Authors can edit, delete, publish, or unpublish their articles
- The "My Articles" page shows status badge for each article
- Publish/unpublish is a one-click action

## API Endpoints

### Public (No Auth Required)
- `GET /api/article/public` - Get all published articles
- `GET /api/article/public/:id` - Get a specific article (if published)

### Authenticated
- `GET /api/article` - Get user's own articles (all statuses)
- `GET /api/article/feed` - Get personalized feed (published articles from others)
- `POST /api/article` - Create new article (status = DRAFT)
- `PUT /api/article/:id` - Update article
- `DELETE /api/article/:id` - Delete article
- `POST /api/article/:id/publish` - Publish article
- `POST /api/article/:id/unpublish` - Unpublish article

## UI Features

### My Articles Page
- Status Badge: 
  - Green badge with checkmark for published articles
  - Outlined badge with circle for drafts
- Publish Button:
  - Shows "Publish" with upload icon for drafts
  - Shows "Unpublish" with file-x icon for published articles
  - Displays loading spinner during operation
- Layout: Status badge next to category in card header, publish button below edit/delete buttons

### Home Page
- Shows all published articles
- No authentication required
- Call-to-action to login/register for interaction features

## Testing

### Manual Testing Steps

1. **Create a Draft Article**
   - Login and go to "My Articles"
   - Click "Create New Article"
   - Fill in details and save
   - Article should show "○ Draft" status

2. **Publish an Article**
   - From "My Articles", click "Publish" on a draft article
   - Status should change to "✓ Published"
   - Logout and visit home page - article should be visible

3. **Unpublish an Article**
   - From "My Articles", click "Unpublish" on a published article
   - Status should change to "○ Draft"
   - Article should disappear from public home page

4. **Public Access**
   - Logout or open incognito window
   - Visit home page (/)
   - Should see only published articles
   - Can view article details but not interact

5. **User Feed**
   - Login as different user
   - Go to dashboard/feed
   - Should only see published articles from other users matching preferences

## Security Considerations

- Publish/unpublish endpoints require authentication
- Only the article author can publish/unpublish their own articles (enforced by `authorId` check in repository)
- Public endpoints only return published articles
- Draft articles are never exposed through public endpoints

## Database Migration

Migration created: `20260213223318_add_publish_status`

```sql
-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "status" "PublishStatus" NOT NULL DEFAULT 'DRAFT';
```

All existing articles will have status = DRAFT by default.

