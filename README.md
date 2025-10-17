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

### Prerequisites
- Node.js 18+ 
- pnpm
- Convex account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/pelican-ai.git
cd pelican-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Convex and Resend credentials

# Start development servers
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev                 # Start both frontend and backend
pnpm dev:frontend        # Frontend only (Vite)
pnpm dev:backend         # Backend only (Convex)

# Building
pnpm build               # Build for production
pnpm lint                # Run TypeScript and build checks

# Testing
pnpm test:beta-auth      # Run all tests (72.7% success rate)
pnpm test:unit           # Unit tests only
pnpm test:integration    # Integration tests only
pnpm test:e2e            # End-to-end tests only
```

## 🏗️ Architecture

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with shadcn/ui components
- **Mobile-first** design with WCAG 2.1 AA compliance

### Backend
- **Convex** for real-time database and serverless functions
- **Better Auth** for authentication (@convex-dev/better-auth)
- **Resend** for email automation
- **OpenAI API** for RAG system (Phase 2+)

### MCP Integrations
- **Convex MCP** - Database monitoring and debugging
- **Playwright MCP** - Automated testing and accessibility validation
- **Firecrawl MCP** - Document scraping and processing
- **Vapi MCP** - Voice interface integration
- **RAG System** - Intelligent document retrieval

## 📊 Current Status

### Phase 1 MVP (Functionally Complete ✅)
- ✅ Beta invitation email system
- ✅ Web signup/auth flow (Better Auth)
- ✅ Automated welcome email
- ✅ Automated weekly prompt email (cron job)
- ✅ Database schema: users, userProfiles, betaSignups, sessions
- ⚠️ **Known Issues:** 72.7% test success rate, Better Auth HTTP endpoint problems

### Phase 2 Backend (Implemented, UI Not Exposed ✅/❌)
- ✅ Framework library backend (80+ CRUD operations)
- ✅ Community features backend (testimonials, innovations)
- ✅ Admin dashboard backend
- ✅ Time tracking backend
- ✅ RAG system integration
- ❌ UI not connected to user-facing routes

## 🎯 Success Metrics (Phase 1)

**Quantitative:**
- 20+ active beta testers
- 75%+ weekly email open rate over 4 weeks
- 80%+ report immediate time savings (10+ minutes per prompt)
- 90%+ satisfaction rating
- <3s page load times
- 99%+ uptime during MVP period

## 🗂️ Project Structure

```
pelican-ai/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── framework/     # Framework library UI
│   │   ├── community/     # Community features UI
│   │   └── ui/            # shadcn/ui components
│   ├── emails/            # Email templates
│   └── lib/               # Utilities and configurations
├── convex/                # Backend (Convex functions)
│   ├── auth.ts           # Authentication logic
│   ├── frameworks.ts     # Framework library backend
│   ├── innovations.ts    # Community innovations
│   └── schema.ts         # Database schema
├── docs/                  # Documentation
├── scripts/               # Testing and utility scripts
└── public/                # Static assets
```

## 🔧 Development

### Database Schema
The project uses Convex with the following key tables:
- `users` - User accounts (Better Auth managed)
- `userProfiles` - Extended user information
- `betaSignups` - Beta program signups
- `frameworks` - AI guidance frameworks
- `testimonials` - User feedback
- `innovations` - Community-shared innovations

### Testing
Comprehensive test suite covering:
- **Unit Tests:** Individual function testing
- **Integration Tests:** Component interaction testing
- **E2E Tests:** Full user flow testing
- **API Tests:** Backend endpoint validation
- **Diagnostic Tests:** Environment and database state

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Custom test runner for comprehensive validation

## 📚 Documentation

- **[Product Requirements](docs/PRODUCT_REQUIREMENTS_DOCUMENT.md)** - Complete product specification
- **[Authentication Architecture](docs/AUTHENTICATION-ARCHITECTURE.md)** - Auth system design
- **[Brand Guidelines](docs/PELICAN_AI_BRAND_GUIDELINES.md)** - Design system and voice
- **[Git Workflow](docs/GIT-WORKFLOW.md)** - Development process
- **[Decision Records](docs/decisions/)** - Architectural decisions

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test:beta-auth`
5. Submit a pull request

## 📞 Support

- **Discord:** [Convex Community](https://discord.gg/convex)
- **Issues:** [GitHub Issues](https://github.com/your-org/pelican-ai/issues)
- **Documentation:** [Project Docs](docs/)

## 📄 License

This project is proprietary software. Educational use by Louisiana educators is permitted under our [Software License Agreement](LICENSE). For commercial licensing or other uses, please contact legal@pelicanai.com.

**Key Points:**
- ✅ **Educational Use:** Louisiana educators can use for classroom instruction and professional development
- ❌ **Commercial Use:** Requires written permission and commercial licensing
- 🔒 **Proprietary:** AI guidance frameworks, Louisiana standards alignment, and platform-agnostic strategies are protected IP
- 📧 **Contact:** For licensing questions, email legal@pelicanai.com

## 🙏 Acknowledgments

- Built for Louisiana educators by Louisiana educators
- Powered by [Convex](https://convex.dev) for real-time backend
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Email templates with [React Email](https://react.email)

---

**Pelican AI** - Navigate AI with Confidence 🦅

*Last Updated: October 2025*
