# Documentation Index

This directory contains all project documentation organized by category.

## 📂 Directory Structure

```
docs/
├── features/           # Feature implementation documentation
├── guides/             # Development and testing guides
└── architecture/       # System architecture documentation
```

## 📚 All Documentation

### Main Documentation
- **[DOCUMENTATION.md](../DOCUMENTATION.md)** - Complete documentation with all features and links
- **[README.md](../README.md)** - Project overview and quick start

---

## 🎯 Features

All feature implementations with detailed guides:

### Authentication
- **[Login Modal Implementation](features/LOGIN_MODAL_IMPLEMENTATION.md)**
  - Modal-based authentication system
  - No separate login page
  - Seamless user experience
  
- **[Login Redirect Fix](features/LOGIN_REDIRECT_FIX.md)**
  - Fixed authentication redirects
  - Protected routes redirect to home
  - Related to login modal implementation

### Articles & Content
- **[Rich Text Editor Implementation](features/RICH_TEXT_EDITOR_IMPLEMENTATION.md)**
  - TipTap WYSIWYG editor
  - 20+ formatting options
  - Professional content creation

- **[Article Page View Implementation](features/ARTICLE_PAGE_VIEW_IMPLEMENTATION.md)**
  - Dedicated article detail pages
  - Shareable URLs
  - Professional layout

- **[Public Pages Implementation](features/PUBLIC_PAGES_IMPLEMENTATION.md)**
  - Browse articles without login
  - Public-facing article listings
  - Guest-friendly interface

### Publishing
- **[Publish Feature Implementation](features/PUBLISH_FEATURE_IMPLEMENTATION.md)**
  - Draft/Published workflow
  - Explicit publish action
  - Status management system

### Image Management
- **[Image Upload Implementation](features/IMAGE_UPLOAD_IMPLEMENTATION.md)**
  - File upload endpoints
  - Client & server validation
  - Local storage system

- **[Editor Image Upload & Featured Images](features/EDITOR_IMAGE_UPLOAD_AND_FEATURED_IMAGE.md)**
  - Upload images in editor
  - Featured image system
  - Multiple image support

---

## 📖 Guides

Development and testing documentation:

- **[Testing Guide](guides/TESTING_GUIDE.md)**
  - Unit testing strategies
  - Integration testing
  - E2E testing
  - Best practices

---

## 🏗️ Architecture

System design and architecture documentation:

- **[Architecture](architecture/ARCHITECTURE.md)**
  - Backend structure (NestJS + Prisma)
  - Frontend architecture (Next.js 14)
  - Database schema
  - API design patterns

---

## 🔗 Quick Reference

### Development Guidelines
- **[Copilot Instructions](../.github/copilot-instructions.md)** - Coding standards and conventions

### Feature Relationships
```
Login Modal
    ↓
Dashboard
    ↓
Create Article (Rich Text Editor + Images)
    ↓
Publish Article
    ↓
Public Pages (Article View)
    ↓
User Interactions
```

### Tech Stack
- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 14 + React + TailwindCSS
- **Editor**: TipTap
- **UI**: shadcn/ui
- **Auth**: JWT + Context API

---

## 📝 Documentation Standards

When updating documentation:

1. ✅ Update existing docs rather than creating new ones
2. ✅ Link related documentation together
3. ✅ Keep docs concise and focused
4. ✅ Use consistent formatting
5. ✅ Include code examples where relevant
6. ✅ Update this index when adding new docs

---

**Last Updated**: February 14, 2026

