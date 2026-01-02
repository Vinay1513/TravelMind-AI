# WanderLust - AI-Powered Travel Itinerary App

## Overview

WanderLust is a full-stack travel planning application that uses AI to generate personalized travel itineraries. Users can explore destinations, get AI-powered city information and recommendations, chat with an AI travel assistant, and save generated itineraries for future reference.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, bundled using Vite
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state and caching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for page transitions and UI animations
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript, executed with tsx
- **API Pattern**: RESTful JSON API with typed route contracts defined in `shared/routes.ts`
- **Build System**: Custom esbuild script for server, Vite for client

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Validation**: Zod schemas auto-generated from Drizzle schemas using drizzle-zod
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization

### Key Design Patterns
- **Shared Types**: Database schemas and API route definitions are shared between client and server via the `shared/` directory
- **Type-Safe API**: Route contracts in `shared/routes.ts` define input/output schemas with Zod validation
- **Storage Abstraction**: `server/storage.ts` implements `IStorage` interface for database operations
- **Component Architecture**: shadcn/ui components in `client/src/components/ui/` with custom components at `client/src/components/`

### Replit Integrations
The project includes pre-built integrations under `server/replit_integrations/`:
- **Batch Processing**: Rate-limited batch operations with retry logic for LLM calls
- **Chat**: Conversation management with OpenAI integration
- **Image Generation**: OpenAI image generation capabilities

## External Dependencies

### AI Services
- **OpenAI API**: Used via Replit AI Integrations (environment variables `AI_INTEGRATIONS_OPENAI_API_KEY` and `AI_INTEGRATIONS_OPENAI_BASE_URL`)
- **Model**: gpt-5.1 for text, gpt-image-1 for images

### External APIs
- **Unsplash API**: City and attraction images (requires `UNSPLASH_ACCESS_KEY`)

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for Express sessions

### Key NPM Dependencies
- Frontend: React, Wouter, TanStack Query, Framer Motion, Radix UI primitives
- Backend: Express, Drizzle ORM, OpenAI SDK, Zod
- Shared: drizzle-zod for schema-to-validation generation