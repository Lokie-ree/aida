# Pelican AI 🦅

> **Navigate AI with Confidence**  
> Platform-agnostic guidance that works with ANY AI tool you already use, designed specifically for Louisiana educators.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/your-org/pelican-ai)
[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![Convex](https://img.shields.io/badge/backend-Convex-00d4aa.svg)](https://convex.dev)
[![React](https://img.shields.io/badge/frontend-React%2019-61dafb.svg)](https://react.dev)

## 🎯 Mission

Empower Louisiana educators with practical, ethical, and platform-agnostic AI guidance that reclaims their time for high-impact teaching.

## ✨ What Makes Us Different

- **🔄 Platform-Agnostic:** Works with ANY AI tool (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.)
- **🏛️ Louisiana-Aligned:** Built for Louisiana state standards and educator rubric
- **📋 Rubric-Infused:** Every feature, every interaction grounded in the Louisiana Educator Rubric
- **⚖️ Ethical Guardrails:** Responsible AI use is built-in
- **⏰ Time-Saving:** Immediate, practical solutions (3-5 hours/week savings target)

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/pelican-ai.git
cd pelican-ai
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Convex and Resend credentials

# Start development
pnpm dev
```

**Available Scripts:**
- `pnpm dev` - Start both frontend and backend
- `pnpm build` - Build for production
- Testing (TypeScript + Vitest + convex-test):
  - `pnpm test` – run tests
  - `pnpm test:once <filter>` – run subset once (e.g., `pnpm test:once frameworks`)
  - `pnpm test:watch` – watch mode
  - `pnpm test:coverage` – coverage report (HTML at `coverage/index.html`)

## 📊 Current Status

**Status:** 🚀 Beta Launch - December 1, 2025  
**Launch Strategy:** Grassroots launch with small group of Louisiana educators (organic, word-of-mouth growth)

**Key Features:**
- ✅ Framework Library (10 platform-agnostic AI guidance frameworks)
- ✅ Dashboard with analytics and time tracking
- ✅ Community features (innovation sharing, testimonials)
- 🚧 Alignment Scorecard (backend complete, UI in development)
- ✅ RAG system for Louisiana Standards with rubric integration

**Testing:** Unit tests (Vitest) + E2E tests (Playwright) with convex-test

**Notes:** Tests run in-memory with convex-test; Better Auth is bridged in tests via a mock tied to `t.withIdentity()`. Scheduled functions are tested using `vi.useFakeTimers()` + `t.finishAllScheduledFunctions()`.

## 📚 Documentation

**Streamlined documentation for grassroots launch.**

### Core Documentation
- **[PROJECT.md](PROJECT.md)** - Project vision, mission, launch strategy, and system overview
- **[CLAUDE.md](CLAUDE.md)** - AI assistant guide with patterns, conventions, and constraints
- **[ROADMAP.md](docs/ROADMAP.md)** - Development roadmap with current sprint and future improvements
- **[docs/README.md](docs/README.md)** - Documentation index

### Operational Reference
- **[TESTING.md](docs/TESTING.md)** - Testing guide and quick reference
- **[IT Whitelisting](docs/IT_WHITELISTING.md)** - IT whitelisting guide for school districts
- **[Rubric Integration Guide](docs/RUBRIC_INTEGRATION_GUIDE.md)** - How the Louisiana Educator Rubric is integrated across all features

### Archived Reference
- **[docs/archived/](docs/archived/)** - Historical documentation including brand guidelines, framework details, architecture validation, and pre-launch materials

**Framework Details:** See `convex/seedFrameworks.ts` for complete framework prompts and specifications.

## 🤝 Contributing

We welcome contributions! Please see **[CLAUDE.md](CLAUDE.md)** for development patterns and conventions.

## 📞 Support

- **Discord:** [Convex Community](https://discord.gg/convex)
- **Issues:** [GitHub Issues](https://github.com/your-org/pelican-ai/issues)
- **Linear:** [Project Management](https://linear.app/web-agency/team/web-agency/active)

## 📄 License

This project is proprietary software. Educational use by Louisiana educators is permitted under our [Software License Agreement](LICENSE). For commercial licensing or other uses, please contact legal@pelicanai.com.

---

**Pelican AI** - Navigate AI with Confidence 🦅

*Last Updated: November 23, 2025*
