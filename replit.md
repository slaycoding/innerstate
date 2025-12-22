# Stillness

## Overview

Stillness is a gentle emotional reflection mobile application built with React Native/Expo. Users answer the prompt "How do I feel right now?" and receive AI-generated calm reflections and metaphors. The app prioritizes a soft, minimal design with no gamification, streaks, or pressure—just a quiet pause for emotional observation and clarity.

The app follows a local-first, single-user approach with no authentication required. It uses a stack-only navigation pattern for focused, linear reflection flows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React Native with Expo SDK 54, using the new architecture and React Compiler experiment enabled.

**Navigation:** Stack-only navigation using `@react-navigation/native-stack`. Four screens in linear flow:
1. CheckIn → Entry point for emotional input
2. Reflection → Displays AI-generated reflection and metaphor
3. VisualState → Optional animated visual representation (fullscreen modal)
4. Settings → App preferences

**State Management:** 
- TanStack React Query for server state and API calls
- Local component state for UI interactions
- AsyncStorage for local persistence

**Styling Approach:**
- Dark mode only (enforced via `useColorScheme` always returning "dark")
- Custom theme system in `client/constants/theme.ts` with semantic color tokens
- Reanimated for smooth animations and micro-interactions
- Haptic feedback on native platforms for tactile responses

**Key UI Components:**
- `SerifText` - Styled text for reflections, metaphors, and prompts
- `Button` - Animated pressable with loading states
- `Card` - Elevated container with spring animations
- `KeyboardAwareScrollViewCompat` - Cross-platform keyboard handling

### Backend Architecture

**Framework:** Express.js server running on Node.js with TypeScript.

**API Endpoints:**
- `POST /api/reflect` - Accepts user input, returns AI-generated reflection with OpenAI

**AI Integration:** OpenAI API for generating empathetic reflections and metaphors. The system prompt enforces calm, non-judgmental, supportive responses in JSON format with `reflection`, `metaphor`, and `emotionalTone` fields.

**Storage:** 
- In-memory storage class (`MemStorage`) for user data
- Drizzle ORM configured with PostgreSQL schema (schema defined but database connection optional for current features)
- Local-first approach means most data stays on device via AsyncStorage

### Build & Development

**Development:** 
- Expo development server with Metro bundler
- Replit-specific environment variable handling for dev domains
- Hot reloading enabled

**Production Build:**
- Custom build script (`scripts/build.js`) for static web output
- Server bundled with esbuild
- Web output configured as single-page application

### Code Organization

```
client/           # React Native frontend
  components/     # Reusable UI components
  screens/        # Screen components
  navigation/     # Stack navigator configuration
  hooks/          # Custom React hooks
  lib/            # API client and utilities
  constants/      # Theme and design tokens

server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Data storage interface
  templates/      # HTML templates for web landing

shared/           # Shared types and schemas
  schema.ts       # Drizzle schema definitions
```

## External Dependencies

### AI Services
- **OpenAI API** - GPT model for generating emotional reflections
  - Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`
  - Model: gpt-5.1

### Database
- **PostgreSQL** - Configured via Drizzle ORM
  - Environment variable: `DATABASE_URL`
  - Currently using in-memory storage; Postgres available for future persistence needs

### Key Libraries
- **Expo SDK 54** - React Native development platform
- **React Navigation 7** - Navigation framework
- **TanStack React Query 5** - Server state management
- **Reanimated 4** - Animation library
- **Drizzle ORM** - Database toolkit with Zod schema validation

### Local Storage
- **AsyncStorage** - Device-local data persistence for reflections and settings