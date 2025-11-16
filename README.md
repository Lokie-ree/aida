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

**Status:** Beta Launch Ready

**Test Coverage:** ~88% statements/lines (`pnpm test:coverage` → open `coverage/index.html`)

**Notes:** Tests run in-memory with convex-test; Better Auth is bridged in tests via a mock tied to `t.withIdentity()`. Scheduled functions are tested using `vi.useFakeTimers()` + `t.finishAllScheduledFunctions()`.

## 📚 Documentation

**MVP Focus:** Lean documentation for launch readiness.

### Essential
- **[PROJECT.md](PROJECT.md)** - Project vision, current status, quick reference
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture reference
- **[TESTING.md](docs/TESTING.md)** - Testing guide and quick reference
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Development guidelines

### Reference
- **[Brand Guidelines](docs/PELICAN_AI_BRAND_GUIDELINES.md)** - Design system and voice
- **[IT Whitelisting](docs/IT_WHITELISTING.md)** - IT whitelisting guide
- **[Documentation Index](docs/README.md)** - Complete documentation structure

**Historical docs:** See `docs/archived/` for reference material.

## 🤝 Contributing

We welcome contributions! Please see **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** for development guidelines.

## 📞 Support

- **Discord:** [Convex Community](https://discord.gg/convex)
- **Issues:** [GitHub Issues](https://github.com/your-org/pelican-ai/issues)
- **Linear:** [Project Management](https://linear.app/web-agency/team/web-agency/active)

## 📄 License

This project is proprietary software. Educational use by Louisiana educators is permitted under our [Software License Agreement](LICENSE). For commercial licensing or other uses, please contact legal@pelicanai.com.

---

**Pelican AI** - Navigate AI with Confidence 🦅

*Last Updated: November 16, 2025*
