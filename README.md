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
- `pnpm test:beta-auth` - Run all tests
- `pnpm build` - Build for production

## 📊 Current Status

**Phase:** Phase 2 UI Exposure (Backend implemented, UI not exposed to users)

**Test Coverage:** See **[Test Suite Documentation](scripts/README.md)** for complete testing results

**Critical Issues:** 3 high-priority bugs identified (see [Linear Issues](https://linear.app/web-agency/team/web-agency/active))

## 📚 Documentation

### Essential Reading
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture, tech stack, database schema
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Development workflow, Git practices, testing
- **[AGENT.md](AGENT.md)** - Agent collaboration patterns, shared context, user personas

### Reference Documentation
- **[Product Requirements](docs/PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Complete product specification
- **[Brand Guidelines](docs/PELICAN_AI_BRAND_GUIDELINES.md)** - Design system and voice
- **[Decision Records](docs/decisions/)** - Architectural decisions (ADRs)
- **[Test Suite](scripts/README.md)** - Testing documentation and protocols

## 🤖 Agent System

This project uses specialized AI agents for different aspects of development:

- **@.cursor/rules/product.mdc** - Product & Design (business strategy, user experience)
- **@.cursor/rules/developer.mdc** - Developer (full-stack implementation, system architecture)
- **@.cursor/rules/qa.mdc** - Quality Assurance (test planning, E2E testing, bug reporting)
- **@.cursor/rules/security.mdc** - Security Specialist (Semgrep analysis, FERPA compliance)

See **[AGENT.md](AGENT.md)** for centralized context and collaboration patterns.

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

*Last Updated: October 20, 2025*
