# Codex - Full-Stack TypeScript Application

A modern full-stack application built with NestJS, Next.js, and shared TypeScript types.

## Architecture

- **Backend**: NestJS with TypeScript, PostgreSQL, Prisma ORM
- **Frontend**: Next.js 14 with App Router, Mantine UI, TypeScript
- **Shared Types**: Common TypeScript types between backend and frontend
- **Database**: PostgreSQL with Prisma ORM

## Project Structure

```
codex/
├── backend/           # NestJS API
│   ├── src/
│   │   ├── modules/    # Feature modules (user, auth)
│   │   ├── common/     # Shared utilities and services
│   │   └── main.ts
│   └── prisma/         # Database schema and migrations
├── frontend/           # Next.js application
│   └── src/
│       ├── app/        # App Router pages
│       ├── components/ # React components
│       │   ├── common/ # Shared components
│       │   └── ui/     # UI components
│       └── lib/        # Utilities
├── shared/             # Shared TypeScript types
│   └── src/
│       └── types/      # Type definitions
└── package.json        # Workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Install dependencies for all packages:

```bash
npm run install:all
```

2. Set up environment variables:

```bash
# Backend
cp backend/env.example backend/.env
# Edit backend/.env with your database URL and JWT secret
```

3. Set up the database:

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Development

Start both backend and frontend in development mode:

```bash
npm run dev
```

This will start:

- Backend API on http://localhost:3001
- Frontend on http://localhost:3000

### Individual Commands

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend

# Build all
npm run build
```

## Features

### Backend (NestJS)

- ✅ Module-driven architecture
- ✅ User management with CRUD operations
- ✅ JWT authentication
- ✅ Class-validator for request validation
- ✅ Prisma ORM with PostgreSQL
- ✅ Global validation pipes
- ✅ CORS configuration

### Frontend (Next.js)

- ✅ App Router with Server Components
- ✅ Mantine UI components
- ✅ TypeScript with shared types
- ✅ Authentication pages
- ✅ Responsive design
- ✅ Error handling

### Shared Types

- ✅ User types (Create, Update, Response)
- ✅ Authentication types
- ✅ API response types
- ✅ TypeScript package for both apps

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /users` - User registration

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  password  String
  firstName String?
  lastName  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Tech Stack

- **Backend**: NestJS, TypeScript, Prisma, PostgreSQL, JWT, Class-validator
- **Frontend**: Next.js 14, React, Mantine, TypeScript, Tailwind CSS
- **Shared**: TypeScript types package
- **Database**: PostgreSQL
- **Development**: Concurrently, ESLint, Prettier
