# ArticleFeed

A modern, full-stack article publishing and feed platform with rich text editing, image uploads, and personalized content recommendations.

## 📚 Documentation

**[📖 Complete Documentation](DOCUMENTATION.md)** - Comprehensive guide with all features and guides

## ✨ Features

### Core Features
- 🔐 **Authentication** - JWT-based auth with modal login (email/phone)
- 📝 **Rich Text Editor** - TipTap WYSIWYG editor with 20+ formatting options
- 📸 **Image Management** - Upload images for articles and inline in editor
- 📤 **Publishing System** - Draft/Published workflow with explicit publish action
- ❤️ **Interactions** - Like, Dislike, Block articles (authenticated users)
- 🌐 **Public Pages** - Browse published articles without login
- 🎯 **Personalized Feed** - Content recommendations based on user preferences
- 🖼️ **Featured Images** - First uploaded image becomes article thumbnail

### Technical Features
- Responsive UI with TailwindCSS
- Type-safe API with TypeScript
- Real-time validation
- Professional article layouts
- SEO-friendly URLs
- File upload with validation

## 🏗️ Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT tokens
- **File Upload**: Multer
- **Validation**: class-validator

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **Rich Text Editor**: TipTap
- **State Management**: React Context API
- **HTTP Client**: Axios

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd ArticleFeed
```

2. **Start with Docker Compose**
```bash
docker-compose up
```

This will start:
- Backend on `http://localhost:4000`
- Frontend on `http://localhost:3000`
- PostgreSQL database

3. **Access the application**
- Open `http://localhost:3000` in your browser
- Register a new account or login
- Start creating articles!

### Manual Setup (without Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npx prisma migrate dev
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local  # Configure your environment variables
npm run dev
```

## 📖 Documentation

### Quick Links
- [📚 Complete Documentation](DOCUMENTATION.md) - All features and guides
- [🏗️ Architecture](docs/architecture/ARCHITECTURE.md) - System design
- [🧪 Testing Guide](docs/guides/TESTING_GUIDE.md) - Testing strategies
- [🤖 Copilot Instructions](.github/copilot-instructions.md) - Development guidelines

### Feature Documentation
- [Login Modal](docs/features/LOGIN_MODAL_IMPLEMENTATION.md)
- [Rich Text Editor](docs/features/RICH_TEXT_EDITOR_IMPLEMENTATION.md)
- [Image Upload](docs/features/IMAGE_UPLOAD_IMPLEMENTATION.md)
- [Publishing System](docs/features/PUBLISH_FEATURE_IMPLEMENTATION.md)
- [Public Pages](docs/features/PUBLIC_PAGES_IMPLEMENTATION.md)
- [Article Pages](docs/features/ARTICLE_PAGE_VIEW_IMPLEMENTATION.md)

## 🎯 Usage

### Creating Your First Article

1. **Register/Login** - Click "Login" and create an account
2. **Navigate to Dashboard** - Go to "My Articles"
3. **Create Article** - Click "Create Article"
4. **Write Content** - Use the rich text editor
5. **Upload Images** - Add a featured image and inline images
6. **Publish** - Click "Create Article" (saves as draft)
7. **Go Public** - Publish from "My Articles" page

### User Interactions

- **Browse Articles** - View public articles on home page
- **Read Articles** - Click any article to read full content
- **Like/Dislike** - Engage with articles you enjoy or dislike
- **Block** - Hide articles you don't want to see

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/articlefeed
JWT_SECRET=your-secret-key
PORT=4000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📁 Project Structure

```
ArticleFeed/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── article/        # Article module
│   │   ├── auth/           # Authentication
│   │   ├── upload/         # File uploads
│   │   └── user/           # User management
│   ├── uploads/            # Uploaded files
│   └── prisma/             # Database schema
├── frontend/               # Next.js frontend
│   └── src/
│       ├── app/            # Pages (App Router)
│       ├── components/     # React components
│       ├── services/       # API services
│       └── lib/            # Utilities
└── docs/                   # Documentation
    ├── features/           # Feature docs
    ├── guides/             # Dev guides
    └── architecture/       # Architecture docs
```

## 🤝 Contributing

1. Read the [Copilot Instructions](.github/copilot-instructions.md)
2. Follow existing code patterns
3. Check for TypeScript errors: `npx tsc --noEmit`
4. Update documentation if needed
5. Keep changes focused and modular

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

- **Documentation**: [DOCUMENTATION.md](DOCUMENTATION.md)
- **Architecture**: [docs/architecture/ARCHITECTURE.md](docs/architecture/ARCHITECTURE.md)
- **Testing**: [docs/guides/TESTING_GUIDE.md](docs/guides/TESTING_GUIDE.md)

---

**Built with ❤️ using NestJS and Next.js**
