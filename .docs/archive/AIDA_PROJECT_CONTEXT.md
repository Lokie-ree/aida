# A.I.D.A. Project Context
**Single Source of Truth for All Project Information**

## 🎯 Mission & Vision
**Mission:** Solve information overload for K-12 educators through voice-enabled AI assistant  
**Vision:** Become the indispensable AI-powered command center for educators  
**Philosophy:** "Go deep, not wide" - hyper-contextualization + voice interface

### Problem Statement
K-12 educators face perpetual information overload, navigating district policies, curriculum guides, and professional development materials without a centralized, intelligent system to synthesize this information. Teachers waste valuable time searching through multiple documents and systems, leading to burnout and fragmented workflows.

## 👥 User Personas
### Primary Persona: K-12 Educator (Sarah)
- **Role:** Classroom teacher, curriculum coordinator, or department head
- **Goals:** Quick access to district policies, improved lesson plans, reduced administrative burden
- **Pain Points:** Information overload, time-consuming searches, lack of personalized feedback
- **Voice Interface:** Prefers hands-free operation for quick queries while multitasking

### Secondary Personas
- **District Administrator (Michael):** Improve teacher efficiency, ensure policy compliance, demonstrate ROI
  - **Key Quote:** "I need tools that actually solve real problems for our teachers, not just add to their workload."
- **Curriculum Coordinator (Jennifer):** Ensure curriculum alignment, support teacher development, maintain quality standards
  - **Key Quote:** "Teachers need quick access to curriculum guidance without having to dig through multiple documents."
- **New Teacher (David):** Learn district policies quickly, improve teaching effectiveness, gain confidence
  - **Key Quote:** "I need help understanding what I'm supposed to do without bothering my colleagues constantly."

## 🏢 Competitive Analysis
### Key Competitive Advantages
- **Hyper-Contextualization:** District-specific knowledge that general-purpose tools cannot provide
- **Voice Interface:** Hands-free, conversational experience unmatched by competitors
- **Integrated Suite:** Cohesive command center vs. fragmented single-purpose tools
- **FERPA Compliance:** Self-hosted architecture with complete data ownership

### Primary Competitors
- **Khanmigo:** Free lesson planning but no district context or voice interface
- **MagicSchool AI:** 50+ tools but no voice interface or district contextualization
- **Brisk Teaching:** Google integration but limited scope and no voice interface
- **TeacherMatic:** Comprehensive tools but no voice interface or district focus
- **Google Classroom:** Massive user base but not voice-first or district-specific

## 🏗️ Technical Architecture
### High-Level Architecture
A.I.D.A. uses a modern, real-time architecture optimized for voice interactions and AI processing, built on the "Anti-SaaS" stack for maximum control and data ownership.

**Core Stack:**
- **Frontend:** React + TypeScript + Vite + Tailwind CSS (deployed on Vercel)
- **Backend:** Convex (real-time DB + serverless functions, deployed on Convex Cloud)
- **AI Engine:** OpenAI GPT-4o-mini for reasoning and generation
- **Voice Interface:** Vapi for real-time speech-to-text and text-to-speech
- **Data Ingestion:** Firecrawl for district document scraping and processing
- **Authentication:** Convex Auth (self-hosted, FERPA-compliant)
- **Components:** RAG, Resend (email), Autumn (billing)

### Convex Components Integration
1. **Convex Auth Component:**
   - Enterprise-grade, self-hosted authentication system
   - Support for email/password and anonymous authentication
   - FERPA compliance: data stays within infrastructure, no third-party sharing

2. **Resend Email Component:**
   - Reliable email delivery and notification system
   - Queueing system with guaranteed delivery
   - Professional templates for educational communications

3. **RAG Component:**
   - Document processing and intelligent search system
   - Vector search across all ingested content
   - Source citations for all AI-generated responses
   - Privacy-first: all processing within Convex deployment

4. **Autumn Billing Component:**
   - Subscription and payment management system
   - Handle teacher Pro subscriptions and district Enterprise plans
   - Usage-based billing for voice queries and feature usage
   - FERPA-compliant payment data handling

## ⚡ Performance Requirements
### Voice Interface Performance
- **Voice Response Time:** <2s for voice queries (critical for demo)
- **Voice Recognition Accuracy:** >90% in quiet environments
- **Voice Processing Latency:** <500ms for speech-to-text conversion
- **Audio Quality:** Clear, natural speech synthesis

### System Performance
- **Load Time:** <3s dashboard, <1s cached content
- **API Response:** <500ms standard queries, <2s complex RAG operations
- **Mobile Performance:** Lighthouse >90 for Performance, Accessibility, and SEO
- **Uptime:** 99.9% availability target

### Scalability Requirements
- **Demo Capacity:** Support 100+ concurrent users
- **Production Capacity:** Support 1000+ concurrent users
- **Voice Processing:** Vapi handles 1M+ concurrent calls
- **Database:** Convex real-time database with automatic scaling

## 📊 Success Metrics
### Business Metrics
- **Conversion Rate:** 15% of free users upgrade to Pro within 90 days
- **Churn Rate:** <5% monthly churn for paid users
- **ARPU:** $50/month per teacher (Pro), $10,000/year per district (Enterprise)
- **Renewal Rate:** >90% for enterprise contracts

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

## 🎯 MVP Core Features
### 1. Voice-Enabled District Assistant
**The "Aha!" Moment:** A teacher asks, "What's our district's policy on student-led projects?" and receives an immediate, accurate answer based on their specific district's documents.

**Key Capabilities:**
- Real-time voice interaction using Vapi
- District-specific knowledge base powered by RAG
- Natural conversation flow with context awareness
- Hands-free operation for busy educators

### 2. AI-Powered Instructional Feedback
**The "Aha!" Moment:** A teacher uploads a lesson plan and receives intelligent suggestions for enhancing engagement and rigor.

**Key Capabilities:**
- Upload lesson plans or prompts
- AI-generated feedback and suggestions
- Focus on engagement and rigor improvements
- Pedagogically sound recommendations

### 3. Teacher Command Center Dashboard
**Purpose:** Centralized overview of key tasks and insights

**Key Capabilities:**
- Quick access to voice assistant
- Lesson plan upload interface
- Recent interactions and feedback
- District context indicators

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

## 🎯 Brand Identity
### Brand Personality
- **Supportive:** Like a trusted colleague who always has your back
- **Intelligent:** Deeply knowledgeable about education with relevant insights
- **Accessible:** Easy to use and understand with voice-first design
- **Reliable:** Consistent, accurate, and dependable

### Core Messaging
- **Tagline:** "Your Voice-Powered Educational Command Center"
- **Elevator Pitch:** A.I.D.A. is the AI assistant that gives K-12 educators instant access to district-specific information and personalized instructional feedback through natural voice interactions.

## 💰 Revenue Model
### Pricing Structure
**Teacher Pro Plan ($50/month):**
- Unlimited voice queries for district policy questions
- Advanced lesson plan feedback (unlimited uploads)
- Priority support and faster response times
- Custom document ingestion for personal materials

**District Enterprise Plan ($10,000/year):**
- All Teacher Pro features for all district teachers
- District-wide document ingestion and management
- Advanced analytics and usage reporting
- Dedicated support and custom integrations
- FERPA-compliant data handling and audit trails

## 🚀 Implementation Roadmap
### Phase 1: MVP Development (Hackathon - 3 days)
- **Goal:** Build and demonstrate core voice assistant and instructional feedback capabilities
- **Key Deliverables:** 
  - Voice-enabled district assistant with Vapi integration
  - AI-powered lesson plan feedback system
  - Basic dashboard with Convex backend
  - RAG pipeline with Firecrawl document ingestion
  - Working demo for hackathon judges

### Phase 2: Pilot & Validation (Post-Hackathon - 3 months)  
- **Goal:** Validate product-market fit with early adopter teachers
- **Key Deliverables:** 
  - Refined voice interface based on user feedback
  - Enhanced RAG accuracy and response quality
  - Teacher onboarding flow and documentation
  - Pilot program with 10-20 teachers
  - Case study and success metrics

### Phase 3: District Rollout (6-12 months)
- **Goal:** Scale to full district-wide implementation with enterprise features
- **Key Deliverables:** 
  - Enterprise authentication and security
  - Advanced analytics and reporting
  - District-wide document ingestion
  - Custom integrations and APIs
  - Full sales and support team

## 🛠️ Available MCPs
- **Convex:** Backend operations, RAG pipeline, voice analytics
- **Vapi:** Voice AI integration and testing
- **Convex Auth:** Authentication and user management
- **Playwright:** Automated testing and validation
- **Firecrawl:** Web scraping and research
- **ShadCN:** UI component library with copy-paste components for voice-first design
