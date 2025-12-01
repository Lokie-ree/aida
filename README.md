# Pelican AI

**Navigate AI with Confidence**

Pelican AI is an intelligent coaching assistant for Louisiana K-12 educators, helping them generate high-quality, Louisiana-aligned prompts for use in any AI tool (ChatGPT, Claude, Gemini, etc.). The platform is built specifically for Louisiana educators navigating LEADS evaluations and the Louisiana Educator Rubric.

## 🎯 Core Mission

Platform-agnostic guidance that improves teaching practice through Louisiana-specific alignment, not just generic AI assistance.

**What We Are:**
- ✅ A conversational guide that understands Louisiana education context
- ✅ Platform-agnostic (works with whatever AI tool teachers prefer)
- ✅ Teacher-to-teacher authentic (built by a Louisiana educator)
- ✅ Focused on improving practice, not just saving time

**What We Are NOT:**
- ❌ Replacing ChatGPT/Claude/Gemini
- ❌ Another generic AI assistant
- ❌ A content generator that does the teaching for them
- ❌ A dashboard full of features to learn

## 🚀 Current Product Status

### ✅ Core Product: Conversational Prompt Coach

**Status:** ✅ **LIVE AND OPERATIONAL**

The **Conversational Prompt Coach** is the primary product experience. It provides:

1. **Conversational chat interface** where teachers describe what they're teaching
2. **Intelligent clarifying questions** (like a colleague, not a form)
3. **Louisiana-aligned prompt generation** teachers can copy/paste into ChatGPT, Claude, Gemini, etc.
4. **Prompt library** to save and reuse successful prompts
5. **Feedback loop** for refinement and improvement

**Access:** Navigate to `/coach` after signing in.

### ✅ Supporting Features

- **User Profiles** - Personalize coach recommendations based on grade/subject
- **Generated Prompts Library** - Save and reuse prompts from coaching conversations
- **Framework Library** - Pre-built exemplar prompts (populated from successful beta conversations)
- **RAG Integration** - 🚧 **IN PROGRESS** - Louisiana standards and rubric data ingestion planned (see `docs/RAG_INGESTION_PLAN.md`)

## 🛠️ Tech Stack

### Frontend
- React 19 + Vite 6
- React Router v7
- Radix UI + shadcn/ui + Tailwind CSS v4
- Framer Motion
- React Hook Form + Zod
- Better Auth
- Convex (real-time subscriptions)

### Backend
- Convex (serverless backend)
- Better Auth via `@convex-dev/better-auth`
- RAG (`@convex-dev/rag`) for Louisiana Student Standards and Louisiana Educator Rubric
- AI Agents (`@convex-dev/agent`) for conversational prompt coaching
- Workflows (`@convex-dev/workflow`) for multi-step processes
- OpenAI (GPT-4o, text-embedding-3-small)

## 📦 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Convex account and project
- OpenAI API key
- Resend API key (for transactional emails)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd aida
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Convex:**
   ```bash
   npx convex dev
   ```
   This will prompt you to create a Convex project if you don't have one.

4. **Configure environment variables in Convex Dashboard:**
   - `OPENAI_API_KEY` - OpenAI API key for GPT-4o and embeddings
   - `RESEND_API_KEY` - Resend API key for transactional emails
   - Better Auth configuration (see `convex/auth.config.ts`)

5. **Start development servers:**
   ```bash
   pnpm dev
   ```
   This starts both the frontend (Vite) and backend (Convex) servers.

   Or start them separately:
   ```bash
   # Frontend only
   pnpm dev:frontend
   
   # Backend only
   pnpm dev:backend
   ```

6. **Open your browser:**
   The app should automatically open at `http://localhost:5173`

## 🧪 Testing

### Backend Tests
```bash
# Run all tests
pnpm test

# Run tests once (no watch mode)
pnpm test:once

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test convex/tests/alignmentScorecard.test.ts
```

### E2E Tests
```bash
# Run E2E tests (requires dev servers running)
pnpm test:e2e

# Watch mode
pnpm test:e2e:watch

# With UI
pnpm test:e2e:ui
```

See `tests/e2e/README.md` for detailed E2E testing setup.

## 🏗️ Building

```bash
# Production build (includes TypeScript checks, lint, and Convex validation)
pnpm build
```

This runs:
1. TypeScript type checking (frontend)
2. TypeScript type checking (backend)
3. Convex validation (`convex dev --once`)
4. Vite production build

## 📝 Linting

```bash
# TypeScript type checking + Convex validation + production build
pnpm lint
```

## 📚 Project Structure

```
convex/           # Convex backend (serverless functions)
├── tests/        # Backend tests
├── schema.ts     # Database schema
├── rag.ts        # RAG initialization
├── promptCoach.ts # Conversational AI coach (CORE PRODUCT)
├── frameworks.ts # Framework CRUD
└── ...

src/              # React frontend
├── components/
│   ├── coach/    # Prompt Coach UI (CORE PRODUCT)
│   ├── framework/ # Framework Library
│   ├── dashboard/ # Dashboard components
│   └── ...
├── App.tsx       # Root component with routing
└── main.tsx      # Application entry point

knowledge/        # Louisiana education data (markdown source files)
├── la-ela-standards.json
├── la-math-standards.json
└── la-rubric-evaluation-handbook.json
```

## 🔑 Key Features

### Conversational Prompt Coach
The core product experience. Teachers describe what they're teaching, and the AI coach:
- Asks clarifying questions (like a colleague, not a form)
- Demonstrates knowledge of Louisiana Educator Rubric and Louisiana Student Standards
- Generates platform-agnostic prompts for any AI tool
- Saves successful prompts to a personal library

### Louisiana-Specific Intelligence
Every generated prompt demonstrates knowledge of:
- Louisiana Educator Rubric (LER) indicators
- Louisiana Student Standards (grade-specific)
- LEADS evaluation framework
- Common Louisiana curriculum resources

### Platform-Agnostic Output
Generated prompts work in:
- ChatGPT
- Claude
- Gemini
- MagicSchool AI
- Any other AI tool

## 📖 Documentation

- **Product Vision:** `VISION.md` - Complete product strategy and beta testing plan
- **Development Guide:** `CLAUDE.md` - AI assistant guide for working with this codebase
- **Changelog:** `CHANGELOG.md` - All notable changes to the project

## 🤝 Contributing

This is currently a private project for Louisiana educators. For questions or feedback, please contact the project maintainer.

## 📄 License

See `LICENSE` file for details.

## 🙏 Acknowledgments

Built by a Louisiana educator for Louisiana educators. We're not waiting for LDOE—we're building practical AI guidance now.

---

**Pelican AI** - The intelligent colleague who helps Louisiana teachers transform vague AI interactions into Louisiana-aligned instructional excellence.

