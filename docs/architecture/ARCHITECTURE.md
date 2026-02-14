# Public Pages - User Flow & Architecture

## 🎯 Overview

The application now supports **true public access** where users can browse and read articles without authentication. Authentication is only required for interactions and personalized features.

## 📊 User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     User Visits Site                            │
│                   (http://localhost:3000)                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  Is Logged In? │
              └───────┬───────┘
                      │
         ┌────────────┴────────────┐
         │                         │
    ┌────▼─────┐            ┌─────▼──────┐
    │   YES    │            │     NO     │
    └────┬─────┘            └─────┬──────┘
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌──────────────────┐
│  Redirect to    │       │  Show Public     │
│   Dashboard     │       │   Home Page      │
│                 │       │                  │
│ - Personal feed │       │ - All articles   │
│ - Interactions  │       │ - Can read all   │
│ - Create/Edit   │       │ - Login prompts  │
└─────────────────┘       └──────────────────┘
```

## 🔐 Authentication Requirements

### ❌ No Auth Required
- `GET /` - Home page with all articles
- `GET /article/public` - API: Fetch all articles
- `GET /article/public/:id` - API: Fetch single article
- View article details
- Browse article list
- See article metadata

### ✅ Auth Required
- `GET /dashboard` - Personalized feed
- `GET /article/feed` - API: Personalized feed
- `GET /article` - API: User's articles
- `POST /article` - Create article
- `PUT /article/:id` - Update article
- `DELETE /article/:id` - Delete article
- `POST /interaction/:id` - Like/Dislike/Block
- `/settings` - User settings
- `/articles/create` - Create article page
- `/articles/my-articles` - User's articles page
- `/articles/edit/:id` - Edit article page

## 🗺️ Page Routes

### Public Routes
```
/                           → Home page (all articles)
/login                      → Login page
/register                   → Registration page
/articles/[id]              → Article detail page (public view)
```

### Protected Routes
```
/dashboard                  → User dashboard (personalized feed)
/articles/my-articles       → User's own articles
/articles/create            → Create new article
/articles/edit/[id]         → Edit article
/settings                   → User settings
```

## 🏗️ Architecture

### Backend API Structure
```
┌─────────────────────────────────────────────┐
│           ArticleController                  │
├─────────────────────────────────────────────┤
│                                              │
│  Public Endpoints (No JWT Middleware)       │
│  ├─ GET  /api/article/public                │
│  └─ GET  /api/article/public/:id            │
│                                              │
│  Protected Endpoints (JWT Middleware)       │
│  ├─ GET    /api/article/feed                │
│  ├─ GET    /api/article                     │
│  ├─ GET    /api/article/:id                 │
│  ├─ POST   /api/article                     │
│  ├─ PUT    /api/article/:id                 │
│  └─ DELETE /api/article/:id                 │
│                                              │
└─────────────────────────────────────────────┘
```

### Frontend Component Hierarchy
```
App (RootLayout)
└── AuthProvider
    ├── Navigation (always visible)
    │   ├── Public Nav (Home, Login, Sign Up)
    │   └── Auth Nav (Dashboard, My Articles, User Menu)
    │
    └── Pages
        ├── Public
        │   ├── HomePage (/)
        │   │   └── ArticleCard (isPublic=true)
        │   ├── LoginPage
        │   └── RegisterPage
        │
        └── Protected
            ├── DashboardPage (/dashboard)
            │   └── ArticleCard (isPublic=false)
            ├── MyArticlesPage
            ├── CreateArticlePage
            ├── EditArticlePage
            └── SettingsPage
```

## 🎨 UI Components

### Navigation Bar
```
┌─────────────────────────────────────────────────────────┐
│  ArticleFeeds  │  Home  │           Login  │  Sign Up   │  ← Public
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  ArticleFeeds  │  Dashboard  │  My Articles  │  [User]  │  ← Auth
└─────────────────────────────────────────────────────────┘
```

### Article Card (Public View)
```
┌──────────────────────────────────────────┐
│  [Article Image]                         │
│                                          │
│  Article Title                   [Tech]  │
│  Short description...                    │
│                                          │
│  #tag1 #tag2 #tag3                      │
│                                          │
│  👤 John Doe    📅 Feb 14, 2026         │
└──────────────────────────────────────────┘

Click opens dialog with full content
```

### Article Dialog (Public View)
```
┌─────────────────────────────────────────────────┐
│  Article Title                                  │
├─────────────────────────────────────────────────┤
│  [Full Image]                                   │
│                                                 │
│  👤 John Doe    📅 Feb 14, 2026    [Tech]      │
│                                                 │
│  Full article content here...                   │
│  Multiple paragraphs...                         │
│                                                 │
│  #tag1 #tag2 #tag3                             │
│                                                 │
│  ────────────────────────────────────────       │
│                                                 │
│  Sign in to interact with articles             │
│  [Login]  [Sign Up]                            │
└─────────────────────────────────────────────────┘
```

### Article Dialog (Authenticated View)
```
┌─────────────────────────────────────────────────┐
│  Article Title                                  │
├─────────────────────────────────────────────────┤
│  [Full Image]                                   │
│                                                 │
│  👤 John Doe    📅 Feb 14, 2026    [Tech]      │
│                                                 │
│  Full article content here...                   │
│                                                 │
│  #tag1 #tag2 #tag3                             │
│                                                 │
│  ────────────────────────────────────────       │
│                                                 │
│  👍 Like (5)  👎 Dislike (1)  🚫 Block         │
└─────────────────────────────────────────────────┘
```

## 📦 Data Flow

### Public Article Fetch
```
Frontend                Backend                  Database
   │                       │                        │
   ├─ GET /article/public ─►                       │
   │                       ├─ findAll() ──────────►│
   │                       │                        │
   │                       │◄─── articles[] ────────┤
   │◄── articles + counts ─┤                        │
   │                       │                        │
   └─ Display in UI        │                        │
```

### Authenticated Feed Fetch
```
Frontend                Backend                  Database
   │                       │                        │
   ├─ GET /article/feed ──►│                       │
   │  (with auth token)    │                        │
   │                       ├─ verify JWT            │
   │                       ├─ get user prefs        │
   │                       ├─ findByCategory() ────►│
   │                       │                        │
   │                       │◄─ filtered articles ───┤
   │◄── personalized feed ─┤                        │
   │                       │                        │
   └─ Display in UI        │                        │
```

## 🔒 Security Considerations

### ✅ Implemented
- JWT middleware excludes public routes
- Public endpoints don't expose sensitive user data
- Auth token is optional in API client
- Protected routes check authentication
- Client-side redirects for auth states

### 🛡️ Best Practices
- Public articles don't show user emails
- Interaction counts don't reveal user identities
- Block interactions are private
- User preferences are only used server-side

## 🚀 Performance Optimizations

- Public articles fetched once on page load
- Authenticated feed uses user preferences for filtering
- Articles include author data (no N+1 queries)
- Images lazy loaded with Next.js Image component
- Static page generation where possible

## 🔄 State Management

### AuthContext Provides:
- `user` - Current user object or null
- `isLoading` - Loading state for auth check
- `login()` - Login function
- `logout()` - Logout function
- `refreshUser()` - Refresh user data

### Usage in Components:
```typescript
const { user, isLoading } = useAuth();

// Show loading
if (isLoading) return <Loader />;

// Check authentication
if (!user) {
  // Show public view
} else {
  // Show authenticated view
}
```

## 📱 Responsive Design

- Mobile-first approach
- Hamburger menu for mobile navigation
- Article grid adapts: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- Touch-friendly buttons and interactions
- Sheet component for mobile navigation drawer

## ✨ User Experience Highlights

1. **Seamless Browsing**: No auth wall for reading content
2. **Clear CTAs**: Login prompts appear contextually
3. **Smart Redirects**: Logged-in users go straight to dashboard
4. **Consistent UI**: Same article cards everywhere
5. **Progressive Enhancement**: More features when logged in
6. **Mobile Optimized**: Works great on all devices

## 🎯 Key Features

### For Anonymous Users:
- Browse all articles
- Read full content
- See author information
- View tags and categories
- Search/filter capabilities (if implemented)

### For Registered Users:
- All anonymous features +
- Personalized feed
- Like/dislike articles
- Block unwanted content
- Create own articles
- Edit own articles
- Track interactions

---

**Last Updated**: February 14, 2026
**Version**: 1.0.0
**Status**: ✅ Fully Implemented & Tested
