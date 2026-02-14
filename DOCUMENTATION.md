# ArticleFeed Documentation

Welcome to the ArticleFeed documentation! This guide will help you understand the project structure, features, and development guidelines.

## 📚 Table of Contents

### Getting Started
- [Project Overview](#project-overview)
- [Quick Start Guide](README.md)
- [Architecture Overview](docs/architecture/ARCHITECTURE.md)

### Development Guides
- [Testing Guide](docs/guides/TESTING_GUIDE.md)
- [Copilot Instructions](.github/copilot-instructions.md)

### Features Documentation
- [Authentication & Login](#authentication--login)
- [Articles Management](#articles-management)
- [Publishing System](#publishing-system)
- [Image Management](#image-management)

---

## Project Overview

ArticleFeed is a modern article publishing and feed platform with:
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + React + TailwindCSS
- **Key Features**: Rich text editing, image uploads, personalized feeds, authentication

---

## Authentication & Login

### 🔐 Login Modal System
**[Login Modal Implementation](docs/features/LOGIN_MODAL_IMPLEMENTATION.md)**
- Modal-based authentication (no `/login` page)
- Login from anywhere in the app
- Seamless user experience
- Related: [Login Redirect Fix](docs/features/LOGIN_REDIRECT_FIX.md)

**Quick Summary:**
- Click "Login" button → Modal appears
- Enter credentials → Logged in
- Modal closes → Stay on current page

---

## Articles Management

### 📝 Rich Text Editor
**[Rich Text Editor Implementation](docs/features/RICH_TEXT_EDITOR_IMPLEMENTATION.md)**
- TipTap-based WYSIWYG editor
- 20+ formatting options
- Inline image uploads
- Professional typography

**Related:**
- [Editor Image Upload & Featured Images](docs/features/EDITOR_IMAGE_UPLOAD_AND_FEATURED_IMAGE.md)

**Quick Summary:**
- Full-featured editor with toolbar
- Insert images directly while writing
- Auto-save as HTML content
- Beautiful rendered output

### 📄 Article Views
**[Article Page View Implementation](docs/features/ARTICLE_PAGE_VIEW_IMPLEMENTATION.md)**
- Dedicated article detail pages
- Featured image display
- Formatted content rendering
- Interaction buttons (Like/Dislike/Block)

**Quick Summary:**
- Click article card → Navigate to full page
- Shareable URLs for each article
- Professional layout with hero image
- Interactive engagement features

### 🌐 Public Pages
**[Public Pages Implementation](docs/features/PUBLIC_PAGES_IMPLEMENTATION.md)**
- Browse articles without login
- Public article listings
- Guest-friendly interface
- Login modal for interactions

**Quick Summary:**
- Anyone can browse published articles
- No authentication required to view
- Login required only for interactions
- Seamless transition to authenticated features

---

## Publishing System

### 📤 Publish/Unpublish Feature
**[Publish Feature Implementation](docs/features/PUBLISH_FEATURE_IMPLEMENTATION.md)**
- Draft → Published workflow
- Explicit publish action
- Unpublish capability
- Status management

**Quick Summary:**
- Articles start as DRAFT
- Publish when ready
- Only published articles are public
- Can unpublish anytime

---

## Image Management

### 📸 Image Upload System
**[Image Upload Implementation](docs/features/IMAGE_UPLOAD_IMPLEMENTATION.md)**
- File upload endpoints
- Client & server validation
- Local storage system
- Image preview grid

**Quick Summary:**
- Upload images for articles
- Max 5MB per image
- Supports JPG, PNG, GIF, WebP
- Automatic URL generation

### 🖼️ Featured Images & Editor Uploads
**[Editor Image Upload & Featured Images](docs/features/EDITOR_IMAGE_UPLOAD_AND_FEATURED_IMAGE.md)**
- Upload images in rich text editor
- First image = featured image
- Multiple image support
- Visual indicators

**Quick Summary:**
- Click image button in editor → Upload image
- First uploaded image shows in article cards
- Featured badge indicator
- Images embedded in content

---

## Architecture

### 🏗️ System Architecture
**[Architecture Documentation](docs/architecture/ARCHITECTURE.md)**
- Backend structure
- Frontend architecture
- Database schema
- API design

**Quick Links:**
- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Next.js 14 + React + TailwindCSS
- Authentication: JWT tokens + Context API
- File Storage: Local uploads directory

---

## Development

### 🧪 Testing
**[Testing Guide](docs/guides/TESTING_GUIDE.md)**
- Unit testing
- Integration testing
- E2E testing
- Best practices

### 🤖 Copilot Instructions
**[Development Guidelines](.github/copilot-instructions.md)**
- Coding standards
- Project conventions
- Common patterns
- Quick reference

---

## Feature Relationships

```
Authentication (Login Modal)
    ↓
User Dashboard
    ↓
Create Article (Rich Text Editor + Image Upload)
    ↓
Save as Draft
    ↓
Publish Article (Publish Feature)
    ↓
Public Display (Public Pages + Article View)
    ↓
User Interactions (Like/Dislike/Block)
```

---

## Quick Reference

### Tech Stack
- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL
- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Editor**: TipTap
- **UI**: shadcn/ui
- **Auth**: JWT + Context API
- **File Storage**: Multer + Local Storage

### Key Directories
```
ArticleFeed/
├── backend/               # NestJS backend
│   ├── src/
│   │   ├── article/      # Article module
│   │   ├── auth/         # Auth module
│   │   ├── upload/       # Upload module
│   │   └── user/         # User module
│   └── uploads/          # Uploaded files
├── frontend/             # Next.js frontend
│   └── src/
│       ├── app/          # Pages (App Router)
│       ├── components/   # React components
│       └── services/     # API services
└── docs/                 # Documentation
    ├── features/         # Feature docs
    ├── guides/           # Development guides
    └── architecture/     # Architecture docs
```

### Environment Setup
```bash
# Backend
cd backend
npm install
npx prisma migrate dev

# Frontend
cd frontend
npm install

# Run with Docker
docker-compose up
```

### Common Commands
```bash
# Backend
npm run build              # Check compilation
npx prisma migrate dev     # Create migration
npx prisma studio          # View database

# Frontend
npx tsc --noEmit          # Check TypeScript
npm run build             # Build for production
```

---

## Documentation Structure

```
docs/
├── features/                           # Feature implementations
│   ├── LOGIN_MODAL_IMPLEMENTATION.md
│   ├── LOGIN_REDIRECT_FIX.md
│   ├── RICH_TEXT_EDITOR_IMPLEMENTATION.md
│   ├── EDITOR_IMAGE_UPLOAD_AND_FEATURED_IMAGE.md
│   ├── IMAGE_UPLOAD_IMPLEMENTATION.md
│   ├── PUBLISH_FEATURE_IMPLEMENTATION.md
│   ├── PUBLIC_PAGES_IMPLEMENTATION.md
│   └── ARTICLE_PAGE_VIEW_IMPLEMENTATION.md
├── guides/                             # Development guides
│   └── TESTING_GUIDE.md
└── architecture/                       # System architecture
    └── ARCHITECTURE.md
```

---

## Contributing

1. Read the [Copilot Instructions](.github/copilot-instructions.md)
2. Follow existing code patterns
3. Test for compilation errors
4. Update documentation if needed
5. Keep changes focused and modular

---

## Support

For questions or issues:
1. Check relevant feature documentation
2. Review architecture docs
3. Consult testing guide
4. Check copilot instructions

---

**Last Updated**: February 14, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅

