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
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - High-level technical architecture
- **[CHANGELOG.md](CHANGELOG.md)** - Version history and progress
- **[docs/decisions/](docs/decisions/)** - Architecture Decision Records (ADRs)

### **Planning Documents** (Archived Reference)
- **[docs/planning/v0.4.0/](docs/planning/)** - Complete planning phase documentation
  - Product Requirements
  - Design System & User Flows
  - Implementation Plan
  - Strategic Foundation

### **Quick Start by Role**
- **Engineers**: [ARCHITECTURE.md](ARCHITECTURE.md) → [Implementation Plan](docs/planning/v0.4.0/implementation-plan.md)
- **Product**: [Strategic Positioning](specs/strategic-positioning.md) → [Product Requirements](docs/planning/v0.4.0/product-requirements.md)
- **Design**: [Brand Guidelines](specs/brand-guidelines.md) → [Design System](docs/planning/v0.4.0/design-documentation/)
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
- **Convex Auth** - Authentication with Better Auth
- **OpenAI API** - AI response generation
- **Resend** - Email service

### **Design System**
- **Lexend** - Primary font (accessibility-focused)
- **Poppins** - Heading font (Louisiana brand)
- **JetBrains Mono** - Monospace font
- **Louisiana Gold** (#FBBF24) - Secondary brand color
- **WCAG 2.1 Level AA** - Accessibility standard

---

## 🎨 Project Structure

```
aida/
├── convex/                    # Backend (Convex)
│   ├── schema.ts             # Database schema
│   ├── frameworks.ts         # Framework API (to be built)
│   ├── testimonials.ts       # Testimonials API (to be built)
│   ├── innovations.ts        # Innovations API (to be built)
│   ├── betaProgram.ts        # Beta program API (to be built)
│   ├── auth.ts               # Authentication (existing)
│   └── documents.ts          # Document management (existing)
├── src/                       # Frontend (React)
│   ├── components/           # React components
│   │   ├── Dashboard.tsx     # Main dashboard (to be built)
│   │   ├── FrameworkLibrary.tsx  # Framework browser (to be built)
│   │   ├── FrameworkDetail.tsx   # Framework detail (to be built)
│   │   ├── CommunityHub.tsx      # Community features (to be built)
│   │   └── ui/               # shadcn/ui components (existing)
│   ├── lib/                  # Utilities
│   │   ├── design-tokens.ts  # Design system tokens
│   │   └── utils.ts          # Helper functions
│   └── main.tsx              # App entry point
├── docs/                      # Documentation
│   ├── decisions/            # Architecture Decision Records
│   └── planning/v0.4.0/      # Planning phase docs (archived)
├── specs/                     # Strategic foundation
├── ARCHITECTURE.md            # Technical architecture (living)
├── CHANGELOG.md               # Version history (living)
├── README.md                  # This file
└── orchestrator.json          # Workflow configuration
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

### **Current Phase: Phase 4 Complete**
✅ Strategic Foundation  
✅ Product Requirements  
✅ Design Documentation  
✅ System Architecture  
✅ Implementation Planning  
🔄 **Next: Software Engineering**

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

---

## 🤝 Contributing

This project follows an orchestrated workflow defined in [`orchestrator.json`](orchestrator.json). 

### **Development Workflow**
1. Review the [Implementation Plan](implementation-plan.md)
2. Follow sequential steps (Week 1 → Week 7)
3. Validate at each checkpoint
4. Submit PRs with clear descriptions

### **Documentation Updates**
1. Update relevant document(s)
2. Increment version number
3. Update [Project Documentation Index](PROJECT_DOCUMENTATION.md)
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
- **Documentation**: [PROJECT_DOCUMENTATION.md](PROJECT_DOCUMENTATION.md)
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

**Last Updated:** October 5, 2025  
**Version:** 1.0  
**Status:** Phase 4 Complete - Ready for Development 🚀
