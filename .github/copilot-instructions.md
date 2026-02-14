 # Copilot Instructions for ArticleFeed Project

## Project Overview
ArticleFeed is a full-stack article publishing and feed platform built with:
- **Backend**: NestJS (TypeScript), Prisma ORM, PostgreSQL
- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, shadcn/ui
- **Architecture**: Monorepo with backend and frontend folders

## Development Environment
- **Backend**: Running on `http://localhost:4000` via Docker Compose
- **Frontend**: Running on `http://localhost:3000` via Docker Compose
- **Database**: PostgreSQL in Docker container
- **File Storage**: Local uploads in `backend/uploads/` directory

## Core Features Implemented
1. **Authentication**: JWT-based auth with email/phone login
2. **Articles**: CRUD operations with rich text editor (TipTap)
3. **Publishing**: Draft/Published status with explicit publish action
4. **Interactions**: Like, Dislike, Block articles (authenticated users)
5. **Feed**: Personalized feed based on user preferences
6. **Public Pages**: Browse published articles without authentication
7. **Image Upload**: File upload for article images and in-editor
8. **Featured Images**: First image in array is featured/top image

## Key Architectural Decisions

### Backend
- **Structure**: Domain-driven design with repositories, services, controllers
- **DTOs**: Separate DTOs for requests and responses
- **Validation**: Class-validator decorators on DTOs
- **Error Handling**: Custom error handling utilities
- **File Upload**: Multer with local storage in `uploads/images/`
- **Static Files**: Served from `/uploads/` route

### Frontend
- **State Management**: React Context for auth, local state for components
- **API Client**: Axios with interceptors for auth tokens
- **Routing**: Next.js App Router with server/client components
- **Forms**: Controlled components with validation
- **UI**: shadcn/ui components with TailwindCSS
- **Editor**: TipTap rich text editor with upload support
- **Login**: Modal-based (no `/login` page)

### Database Schema
```prisma
User: id, firstName, lastName, email, phone, dob, password, preferences[]
Article: id, title, description, content (HTML), category, images[], tags[], authorId, status (DRAFT/PUBLISHED), publishedAt
Interaction: userId, articleId, type (LIKE/DISLIKE/BLOCK)
```

## Important Implementation Details

### Authentication
- Token stored in localStorage as 'authToken'
- AuthContext provides user state and login/logout methods
- Protected routes redirect to home (`/`) not `/login` (deleted)
- Login modal opens on interaction attempts when not authenticated

### Articles
- **Content**: Stored as HTML from TipTap editor
- **Images**: Array of URLs, first image is featured
- **Status**: DRAFT by default, must explicitly publish
- **Public API**: `/api/article/public` returns only PUBLISHED articles
- **Private API**: `/api/article` returns user's articles (all statuses)

### Image Upload
- **Endpoint**: `POST /api/upload/image` (multipart/form-data)
- **Validation**: Max 5MB, types: JPG, JPEG, PNG, GIF, WebP
- **Storage**: `backend/uploads/images/{uuid}{ext}`
- **Access**: `${API_URL}/uploads/images/{filename}`
- **Editor**: Click image toolbar button → file picker → upload → insert

### UI Components
- **Navigation**: Modal-based login, shows Login button when not authenticated
- **Article Card**: Displays featured image, title, description, metadata
- **Article Detail**: Hero image, formatted content, interaction buttons
- **Rich Text Editor**: Full toolbar with upload support, renders HTML content

## Working Guidelines

### When Writing Code

1. **Don't Create Documentation**: After completing features, DO NOT create new .md files
   - Only edit existing documentation if specifically needed
   - Link related docs together
   - Keep docs concise and up-to-date

2. **Test Backend Changes**: After modifying backend code:
   - Check for TypeScript compilation errors: `cd backend && npm run build`
   - Server is already running in Docker Compose
   - Only check for errors, don't restart unless necessary
   - User will test functionality

3. **Test Frontend Changes**: After modifying frontend code:
   - Check for TypeScript errors: `cd frontend && npx tsc --noEmit`
   - Check for build errors if needed: `npm run build`
   - Frontend is already running in Docker Compose
   - User will test in browser

4. **Database Changes**: When modifying schema:
   - Update `backend/prisma/schema.prisma`
   - Generate migration: `npx prisma migrate dev --name migration_name`
   - Prisma Client regenerates automatically
   - Database runs in Docker, no manual restart needed

5. **File Organization**:
   - Backend: Follow existing structure (controllers, services, repositories, DTOs)
   - Frontend: Use App Router structure, client components with 'use client'
   - Keep related files together (service with types)

### Code Style

**Backend (NestJS)**:
- Use decorators for routing, validation, guards
- Dependency injection via constructors
- Return `HTTP_RESPONSE<T>` type from controllers
- Use Prisma for database operations
- Error handling with try-catch and custom error utils

**Frontend (Next.js)**:
- 'use client' for interactive components
- Server components where possible
- Custom hooks for reusable logic
- Axios for API calls with error handling
- TailwindCSS for styling, shadcn/ui components
- Type imports from '@/lib/types'

### Common Patterns

**API Call Pattern**:
```typescript
// Frontend service
export const exampleService = {
    method: () => handleAsync(() => 
        api.post('/endpoint', data).then(res => res.data)
    ),
};

// Component usage
const { data, error } = await exampleService.method();
if (error || !data?.success) {
    // Handle error
}
// Use data.data
```

**Protected Route Pattern**:
```typescript
useEffect(() => {
    if (!authLoading && !user) {
        router.push('/'); // Not /login!
    }
}, [user, authLoading, router]);
```

**Image Upload Pattern**:
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Validate type and size
    const { url } = await uploadService.uploadImage(file);
    const fullUrl = `${process.env.NEXT_PUBLIC_API_URL}${url}`;
    // Use fullUrl
};
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/articlefeed
JWT_SECRET=your-secret
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Common Tasks

### Adding a New Feature
1. Update database schema if needed (Prisma)
2. Create/update DTOs in backend
3. Implement repository methods
4. Implement service logic
5. Create/update controller endpoints
6. Add frontend service methods
7. Update UI components
8. Test for compilation errors only

### Adding a New Page
1. Create file in `frontend/src/app/{route}/page.tsx`
2. Use 'use client' if interactive
3. Add navigation links if needed
4. Protected routes need auth check
5. Test TypeScript compilation

### Adding a New API Endpoint
1. Add DTO in backend (request/response)
2. Add method to repository if database access needed
3. Add method to service for business logic
4. Add controller method with decorators
5. Add frontend service method
6. Test compilation only

## File Locations Reference

### Backend
- **Controllers**: `backend/src/{domain}/controllers/`
- **Services**: `backend/src/{domain}/services/`
- **Repositories**: `backend/src/{domain}/repositories/`
- **DTOs**: `backend/src/{domain}/dto/`
- **Entities**: `backend/src/{domain}/entities/`
- **Schema**: `backend/prisma/schema.prisma`
- **Main**: `backend/src/main.ts`
- **Module**: `backend/src/app.module.ts`

### Frontend
- **Pages**: `frontend/src/app/{route}/page.tsx`
- **Components**: `frontend/src/components/`
- **Services**: `frontend/src/services/`
- **Types**: `frontend/src/lib/types.ts`
- **Utils**: `frontend/src/utils/`
- **Hooks**: `frontend/src/hooks/`
- **Context**: `frontend/src/lib/auth-context.tsx`

## Documentation Reference

### Main Documentation
- **[DOCUMENTATION.md](../DOCUMENTATION.md)** - Complete documentation index with all features

### Project Docs (read these for context)
- **[README.md](../README.md)** - Project overview and setup
- **[Architecture](../docs/architecture/ARCHITECTURE.md)** - System architecture and design
- **[Testing Guide](../docs/guides/TESTING_GUIDE.md)** - Testing guidelines

### Feature Documentation
- **[Public Pages](../docs/features/PUBLIC_PAGES_IMPLEMENTATION.md)** - Public pages feature
- **[Publish Feature](../docs/features/PUBLISH_FEATURE_IMPLEMENTATION.md)** - Publish/unpublish system
- **[Rich Text Editor](../docs/features/RICH_TEXT_EDITOR_IMPLEMENTATION.md)** - TipTap editor details
- **[Image Upload](../docs/features/IMAGE_UPLOAD_IMPLEMENTATION.md)** - File upload system
- **[Login Modal](../docs/features/LOGIN_MODAL_IMPLEMENTATION.md)** - Modal-based authentication
- **[Article Pages](../docs/features/ARTICLE_PAGE_VIEW_IMPLEMENTATION.md)** - Article detail pages
- **[Login Redirect Fix](../docs/features/LOGIN_REDIRECT_FIX.md)** - Auth redirect fixes
- **[Editor Images & Featured](../docs/features/EDITOR_IMAGE_UPLOAD_AND_FEATURED_IMAGE.md)** - Editor uploads and featured images

### External Documentation
- **NestJS**: https://docs.nestjs.com/
- **Prisma**: https://www.prisma.io/docs/
- **Next.js**: https://nextjs.org/docs
- **TipTap**: https://tiptap.dev/
- **shadcn/ui**: https://ui.shadcn.com/
- **TailwindCSS**: https://tailwindcss.com/docs

## Important Rules

### DO:
- ✅ Read existing code patterns before implementing
- ✅ Follow established folder structure
- ✅ Use existing types and interfaces
- ✅ Check for TypeScript errors after changes
- ✅ Keep features modular and maintainable
- ✅ Use existing utilities and services
- ✅ Update related docs if making architectural changes

### DON'T:
- ❌ Create new documentation files for every feature
- ❌ Restart Docker containers unless absolutely necessary
- ❌ Change core architecture without discussion
- ❌ Add dependencies without checking existing solutions
- ❌ Create `/login` page (uses modal instead)
- ❌ Redirect to `/login` (redirect to `/` instead)
- ❌ Test functionality manually (user will test)
- ❌ Create duplicate code when utilities exist

## Troubleshooting

### TypeScript Errors
- Check imports are correct (`@/` alias for src)
- Ensure types are exported/imported properly
- Check component props match interfaces
- Verify API response types match DTOs

### Backend Issues
- Check Prisma schema matches database
- Verify DTOs have validation decorators
- Ensure modules are imported in app.module
- Check environment variables are set

### Frontend Issues
- Verify API URL is correct
- Check auth token is being sent
- Ensure 'use client' for interactive components
- Verify Next.js App Router conventions

### Docker Issues
- Check docker-compose logs if needed
- Verify environment variables in compose file
- Database migrations run automatically
- Containers restart on code changes (volumes mounted)

## Quick Commands

```bash
# Backend
cd backend
npm run build              # Check compilation
npx prisma migrate dev     # Create migration
npx prisma studio          # View database

# Frontend  
cd frontend
npx tsc --noEmit          # Check TypeScript
npm run build             # Check build

# Docker
docker-compose ps         # Check containers
docker-compose logs -f    # View logs
docker-compose restart    # Restart if needed
```

## Summary

When working on this project:
1. Read the relevant documentation first
2. Follow existing patterns and structure
3. Check for compilation errors only
4. Don't create new docs unless essential
5. Let user test functionality
6. Keep it simple and maintainable

The infrastructure is already running - focus on writing clean, working code that follows the established patterns.

