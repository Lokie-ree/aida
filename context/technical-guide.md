# A.I.D.A. Technical Guide

**Last Updated:** September 23, 2025  
**Owner:** System Architect  
**Purpose:** Complete technical framework, implementation standards, and performance requirements

## 🏗️ System Architecture

### High-Level Architecture
A.I.D.A. uses a modern, real-time architecture optimized for voice interactions and AI processing, built on the "Anti-SaaS" stack for maximum control and data ownership.

- **Front-end:** React + TypeScript with Vite, Tailwind CSS for styling, responsive design
- **Back-end:** Convex (real-time database + serverless functions), TypeScript
- **AI Engine:** OpenAI GPT-4o-mini for reasoning and generation
- **Voice Interface:** Vapi for real-time speech-to-text and text-to-speech
- **Data Ingestion:** Firecrawl for district document scraping and processing
- **Knowledge Base:** Convex RAG component for searchable, private knowledge base
- **Authentication:** Convex + Better Auth for enterprise-grade, self-hosted auth
- **Email:** Convex Resend component for automated notifications
- **Billing:** Convex Autumn component for subscription and payment management
- **Deployment:** Vercel for frontend, Convex Cloud for backend

## 🔧 Convex Components Integration

### 1. Better Auth Component
**Purpose:** Enterprise-grade, self-hosted authentication system
- **Self-hosted Authentication:** Complete control over user data and authentication flow
- **Multiple Providers:** Support for email/password, OAuth providers (Google, Microsoft)
- **FERPA Compliance:** Data stays within your infrastructure, no third-party data sharing

### 2. Resend Email Component
**Purpose:** Reliable email delivery and notification system
- **Queueing System:** Send unlimited emails with guaranteed delivery
- **Professional Templates:** Educational communications and notifications
- **Use Cases:** Welcome emails, lesson plan feedback notifications, district updates

### 3. RAG Component
**Purpose:** Document processing and intelligent search system
- **Document Ingestion:** Process district documents, policies, and curriculum materials
- **Vector Search:** Semantic search across all ingested content
- **Source Citations:** Always provide sources for AI-generated responses
- **Privacy-First:** All processing happens within your Convex deployment

### 4. Autumn Billing Component
**Purpose:** Subscription and payment management system
- **Subscription Management:** Handle teacher Pro subscriptions and district Enterprise plans
- **Usage-Based Billing:** Track voice queries and feature usage for billing
- **FERPA Compliance:** Secure payment data handling with educational privacy standards

## ⚡ Performance Requirements

### Voice Interface Performance
- **Voice Response Time:** <2s for voice queries (critical for demo)
- **Voice Recognition Accuracy:** >90% in quiet environments
- **Voice Processing Latency:** <500ms for speech-to-text conversion
- **Audio Quality:** Clear, natural speech synthesis

### System Performance
- **Load Time:** <3s for dashboard, <1s for cached content
- **API Response:** <500ms for standard queries, <2s for complex RAG operations
- **Mobile Performance:** Lighthouse score >90 for Performance, Accessibility, and SEO
- **Uptime:** 99.9% availability target

### Scalability Requirements
- **Demo Capacity:** Support 100+ concurrent users
- **Production Capacity:** Support 1000+ concurrent users
- **Voice Processing:** Vapi handles 1M+ concurrent calls
- **Database:** Convex real-time database with automatic scaling

## 📊 Quality Metrics

### User Experience Metrics
- **User Satisfaction:** Target 80%+ teacher satisfaction
- **Retention:** 70%+ weekly active users
- **Activation:** First voice query within 24 hours of signup
- **Engagement:** 5+ voice queries per session

### Technical Quality Metrics
- **Test Coverage:** >90% for critical paths, especially voice interface
- **RAG Accuracy:** >90% for district policy questions
- **Error Rate:** <1% for voice processing
- **Accessibility:** WCAG 2.1 AA compliance

### Business Metrics
- **Conversion Rate:** 15% of free users upgrade to Pro within 90 days
- **Churn Rate:** <5% monthly churn for paid users
- **ARPU:** $50/month per teacher (Pro), $10,000/year per district (Enterprise)
- **Renewal Rate:** >90% for enterprise contracts

## 🧪 Implementation Standards

### Testing Strategy
- **Unit Tests:** Jest + React Testing Library for components, Vitest for utilities
- **Integration Tests:** Convex function testing, Vapi integration testing, RAG pipeline validation
- **E2E Tests:** Playwright for voice interface flows, lesson plan feedback workflows
- **Voice Testing:** Automated voice input/output testing, latency measurement
- **RAG Testing:** Document ingestion validation, query accuracy testing

### Development Workflow
- **Git Workflow:** Feature branches for MVP development, main branch for stable releases
- **Code Quality Standards:** TypeScript strict mode, ESLint, Prettier, Husky pre-commit hooks
- **Documentation Standards:** JSDoc for functions, README for components, API documentation
- **Voice Development:** Vapi webhook testing, voice interaction debugging
- **RAG Development:** Document processing validation, query optimization

## 🎨 Design System

### Typography
- **Primary Font:** Inter - Used for all headings and body text
- **Usage:** Font styles managed via Tailwind utility classes

### Color Palette
- **Primary Colors:** 
  - Blue (#3B82F6) - Primary actions, voice interface, trust and reliability
  - Green (#10B981) - Success states, positive feedback, completion
  - Red (#EF4444) - Error states, warnings, critical actions
- **Secondary Colors:** 
  - Purple (#8B5CF6) - AI features, voice responses, innovation
  - Orange (#F59E0B) - Warnings, attention, important information

### Layout & Spacing
- **Grid System:** 12-column responsive grid with Tailwind CSS, mobile-first approach
- **Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px (Tailwind spacing scale)
- **Voice Interface:** Extra spacing around voice elements for touch accessibility

## ♿ Accessibility Guidelines

- **Keyboard Navigation:** All interactive elements must be keyboard-accessible, especially voice interface
- **Color Contrast:** Text and interactive elements must meet WCAG 2.1 AA color contrast standards
- **Screen Reader Support:** All images and icons must have appropriate alt text, voice interface must be screen reader friendly
- **Focus States:** Clearly visible focus indicators for all interactive elements, especially voice buttons
- **Voice Accessibility:** Voice interface must work with assistive technologies, clear audio feedback

## 🔒 Security & Compliance

### FERPA Compliance
- **Data Ownership:** All components run within your Convex deployment
- **No Third-Party Sharing:** Authentication, documents, and analytics stay private
- **Audit Trails:** Complete logging of all data access and modifications
- **Access Controls:** Role-based permissions for different user types

### Performance Optimization
- **Caching Strategy:** Intelligent caching for frequently accessed documents
- **Batch Processing:** Efficient processing of large document collections
- **Real-time Updates:** Live updates for voice queries and document changes
- **Scalability:** Automatic scaling based on usage patterns

## 📁 Code Structure

### Repository Structure
```
/src - Frontend React application
  /components - Reusable UI components
    /ChatInterface.tsx - Voice interaction component
    /DocumentManager.tsx - Document upload and management
    /SpaceSelector.tsx - District space selection
    /VoiceInterface.tsx - Voice UI wrapper
    /WebScrapingManager.tsx - Document ingestion interface
  /lib - Shared utilities and helpers
  /App.tsx - Main application component
  /main.tsx - Application entry point

/convex - Backend Convex functions and schema
  /auth.config.ts - Better Auth configuration
  /auth.ts - Authentication functions
  /chat.ts - Voice conversation handling
  /documents.ts - Document management
  /feedback.ts - Lesson plan feedback system
  /scrapingActions.ts - Firecrawl integration
  /spaces.ts - District space management
  /vapi.ts - Voice interface integration
  /webscraping.ts - Document ingestion
  /rag.ts - RAG component integration
  /email.ts - Resend email component
  /autumn.ts - Autumn client initialization
  /billing.ts - Educational billing functions
  /schema.ts - Database schema definitions
```

### Naming Conventions
- **Files:** `kebab-case.tsx`, `PascalCase.tsx` for components
- **Components:** PascalCase (e.g., `VoiceInterface`, `DocumentManager`)
- **Functions/Variables:** camelCase (e.g., `handleVoiceInput`, `processDocument`)
- **Types/Interfaces:** PascalCase with descriptive names (e.g., `UserProfile`, `LessonPlanFeedback`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`, `API_ENDPOINTS`)

---

*This document serves as the comprehensive technical foundation for all implementation work.*
