# Pelican AI

**Navigate AI with Confidence**

[![Status](https://img.shields.io/badge/Status-Phase%204%20Complete-success)]()
[![Documentation](https://img.shields.io/badge/Docs-Comprehensive-blue)]()
[![License](https://img.shields.io/badge/License-Proprietary-red)]()

---

## 🎯 Project Overview

**Pelican AI** is a platform designed to help Louisiana educators navigate AI with confidence. Rather than offering another AI tool, we provide **curated, vetted guidance** that respects educators' professional judgment and aligns with Louisiana's educational standards.

### **Core Value Proposition**
- 📚 **Guided Frameworks**: Copy-paste ready prompts with ethical guardrails
- 🏫 **Louisiana-Aligned**: Built for Louisiana standards and educator rubric
- 🤝 **Community-Driven**: Educators sharing innovations with educators
- ⏱️ **Time-Saving**: Practical solutions that reclaim valuable teaching time
- 🛡️ **Trust-First**: Transparent, ethical, and educator-controlled

---

## 🚀 Quick Start

### **For Developers**
```bash
# Clone the repository
git clone <repository-url>
cd aida

# Install dependencies
npm install

# Start Convex backend
npx convex dev

# Start frontend (in another terminal)
npm run dev
```

### **For Documentation Readers**
Start with the **[Project Documentation Index](PROJECT_DOCUMENTATION.md)** for complete navigation.

### **For Stakeholders**
1. Read the [Strategic Positioning](specs/strategic-positioning.md)
2. Review the [Product Requirements](product-requirements.md)
3. Explore the [Brand Guidelines](specs/brand-guidelines.md)

---

## 📚 Documentation

### **Core Documents** (Living)
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and progress
- **[docs/decisions/](docs/decisions/)** - Architecture Decision Records (ADRs)
- **[orchestrator.json](orchestrator.json)** - Project configuration and workflow

### **Planning Documents** (Archived Reference)
- **[docs/planning/v0.4.0/](docs/planning/)** - Complete planning phase documentation
  - Product Requirements
  - Design System & User Flows
  - Implementation Plan
  - Strategic Foundation

### **Quick Start by Role**
- **Engineers**: [orchestrator.json](orchestrator.json) → [Implementation Plan](docs/planning/v0.4.0/implementation-plan.md)
- **Product**: [Brand Guidelines](docs/PELICAN_AI_BRAND_GUIDELINES.md) → [Product Requirements](docs/planning/v0.4.0/product-requirements.md)
- **Design**: [Brand Guidelines](docs/PELICAN_AI_BRAND_GUIDELINES.md) → [Design System](docs/planning/v0.4.0/design-documentation/)
- **Stakeholders**: This README → [CHANGELOG.md](CHANGELOG.md)

---

## 🏗️ Tech Stack

### **Frontend**
- **React 19** - Modern UI framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful, accessible components

### **Backend**
- **Convex** - Real-time database and serverless functions
- **Better Auth** - Authentication (via @convex-dev/better-auth)
- **OpenAI API** - AI response generation
- **Resend** - Email service
- **Vapi** - Voice interface integration
- **Firecrawl** - Document scraping and processing

### **Integrations & MCPs**
- **Convex MCP** - Direct deployment monitoring and debugging
- **Vapi MCP** - Voice interface logs and debugging
- **Firecrawl MCP** - Document scraping validation
- **Playwright MCP** - Automated E2E testing (available)

### **Design System**
- **Lexend** - Primary font (accessibility-focused)
- **Poppins** - Heading font (Louisiana brand)
- **JetBrains Mono** - Monospace font
- **Pelican Blue** (#0ea5e9) - Primary brand color
- **Louisiana Gold** (#f59e0b) - Secondary brand color
- **Deep Blue** (#1e40af) - Accent color
- **WCAG 2.1 Level AA** - Accessibility standard
- **8px Base Unit Scale** - Consistent spacing system

---

## 🎨 Project Structure

```
aida/
├── convex/                    # Backend (Convex)
│   ├── schema.ts             # Database schema
│   ├── frameworks.ts         # Framework API
│   ├── testimonials.ts       # Testimonials API
│   ├── innovations.ts        # Innovations API
│   ├── betaProgram.ts        # Beta program API
│   ├── auth.ts               # Authentication
│   ├── documents.ts          # Document management
│   ├── vapi.ts               # Voice interface integration
│   └── rag.ts                # RAG system
├── src/                       # Frontend (React)
│   ├── components/           # React components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── framework/        # Framework components
│   │   ├── community/        # Community features
│   │   ├── auth/             # Authentication components
│   │   ├── shared/           # Shared components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/                  # Utilities
│   │   ├── auth-client.ts    # Auth client configuration
│   │   ├── design-system.ts  # Design system tokens
│   │   └── utils.ts          # Helper functions
│   └── main.tsx              # App entry point
├── docs/                      # Documentation
│   ├── decisions/            # Architecture Decision Records
│   ├── planning/v0.4.0/      # Planning phase docs (archived)
│   └── *.md                  # Living documentation
├── public/                    # Static assets
├── CHANGELOG.md               # Version history (living)
├── README.md                  # This file
└── orchestrator.json          # Project configuration
```

---

## 🌟 Key Features

### **Two Learning Hubs**

#### **AI Basics Hub**
For educators new to AI, focusing on:
- Email drafting and communication
- Newsletter generation
- Lesson planning assistance
- Administrative task automation

#### **Instructional Expert Hub**
For experienced educators, focusing on:
- Louisiana state standards alignment
- Differentiation strategies
- Assessment design
- Curriculum development

### **Community Features**
- **Innovations**: Share creative AI uses with peers
- **Testimonials**: Success stories from Louisiana educators
- **Time Savings Tracker**: Measure your efficiency gains

### **Beta Program**
- Structured onboarding (4 steps)
- Weekly engagement prompts
- Office hours with facilitators
- Community building activities

---

## 📊 Project Status

### **Current Phase: Phase 5 - Software Engineering (In Progress)**
✅ Strategic Foundation  
✅ Product Requirements  
✅ Design Documentation  
✅ System Architecture  
✅ Implementation Planning  
✅ Component Reorganization  
✅ Better Auth Migration  
✅ Email System Integration  
✅ Mobile Responsiveness  
🔄 **Active: Core Feature Implementation**

### **Documentation Metrics**
- **16+ Documents**: Comprehensive coverage
- **8,740+ Lines**: Detailed specifications
- **4 Phases Complete**: Ready for development
- **7-Week Timeline**: Clear implementation path

---

## 🎯 Success Metrics

### **Beta Program Goals (First 3 Months)**
- **50 Active Beta Testers**: Louisiana educators
- **3+ Frameworks/Week**: Average usage per educator
- **120+ Minutes Saved/Week**: Per educator (target)
- **20+ Innovations Shared**: Community contributions
- **80%+ Satisfaction**: Net Promoter Score

### **Platform Metrics**
- **10+ Frameworks**: At launch (5 per hub)
- **<3s Page Load**: Performance target
- **WCAG 2.1 AA**: Accessibility compliance
- **95%+ Uptime**: Reliability target
- **Mobile-First**: 44px touch targets
- **Platform-Agnostic**: Works with any AI tool

---

## 🤝 Contributing

This project follows an orchestrated workflow defined in [`orchestrator.json`](orchestrator.json). 

### **Development Workflow**
1. Review the [orchestrator.json](orchestrator.json) for project configuration
2. Follow the [Implementation Plan](docs/planning/v0.4.0/implementation-plan.md)
3. Validate at each checkpoint
4. Submit PRs with clear descriptions

### **Documentation Updates**
1. Update relevant document(s)
2. Increment version number
3. Update [CHANGELOG.md](CHANGELOG.md)
4. Submit PR with context

---

## 🔒 Security & Privacy

- **FERPA Compliant**: Student data protection
- **Educator-Controlled**: No data shared without permission
- **Transparent**: Clear data usage policies
- **Secure**: Industry-standard encryption and authentication

---

## 📞 Contact & Support

### **Project Leadership**
- **Product Strategy**: [Contact Info]
- **Technical Architecture**: [Contact Info]
- **Design Lead**: [Contact Info]

### **Resources**
- **Documentation**: [docs/](docs/) directory
- **Project Config**: [orchestrator.json](orchestrator.json)
- **Issues**: [GitHub Issues]
- **Discussions**: [GitHub Discussions]

---

## 📜 License

Proprietary - All rights reserved.

---

## 🙏 Acknowledgments

### **Inspired By**
- Louisiana Department of Education
- Louisiana educators and their dedication
- Leading state AI education guidance (Missouri, New Mexico, Utah)

### **Built With**
- [Convex](https://convex.dev) - Backend infrastructure
- [React](https://react.dev) - UI framework
- [shadcn/ui](https://ui.shadcn.com) - Component library
- [Tailwind CSS](https://tailwindcss.com) - Styling framework

---

**Last Updated:** October 8, 2025  
**Version:** 1.1  
**Status:** Phase 5 In Progress - Software Engineering 🚀
