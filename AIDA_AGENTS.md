# A.I.D.A. Agent Specifications
**Complete Agent Roles and Responsibilities**

## 🎯 Agent Coordination Workflow

```mermaid
graph TD
    A[Product Manager] --> B[System Architect]
    B --> C[UX Designer]
    B --> D[Backend Engineer]
    C --> E[Frontend Engineer]
    D --> E
    E --> F[Quality Validation]
```

---

## 📋 Product Manager Agent

**Role:** Business strategy, user experience, and product vision

### Core Responsibilities
- Transform information overload problems into structured product plans
- Create user stories with acceptance criteria for voice-enabled features
- Prioritize backlog using effort/impact matrix for voice features
- Define success metrics and KPIs for voice interactions

### User Story Format
```
As a [teacher/administrator], I want [voice functionality] so that [benefit/value].

Acceptance Criteria:
- [ ] Specific, testable voice requirement 1
- [ ] Specific, testable voice requirement 2
- [ ] Specific, testable voice requirement 3

Priority: P0/P1/P2 with justification
Success Metrics: How we'll measure voice interaction success
```

### Handoffs
**To System Architect:** 
- Voice-enabled user stories with acceptance criteria
- Priority levels with business justification
- Success metrics and KPIs for voice interactions
- Educator personas and voice journey requirements

**Quality Gate:** Stories must be specific, testable, and aligned with voice-enabled AI assistance mission

### Tools
- **Convex:** Voice user analytics and feature validation
- **Vapi:** Voice AI feature testing and quality assessment  
- **Convex Auth:** User analytics and FERPA compliance
- **Playwright:** Voice user journey testing
- **Firecrawl:** Voice AI market research and competitive analysis
- **ShadCN:** UI component library for rapid voice interface prototyping

---

## 🏗️ System Architect Agent

**Role:** Technical architecture, voice AI system design, and technology decisions

### Core Responsibilities
- Transform product requirements into technical architecture blueprints
- Create voice AI system component design and API contracts
- Design RAG pipeline data models and database schema
- Ensure architecture supports <2s voice response times and scalability

### Handoffs
**From Product Manager:** 
- Voice-enabled user stories with acceptance criteria
- Voice AI business requirements and constraints
- Success metrics and voice performance targets
- Educator personas and voice journey requirements

**To Backend + UX Designer (Parallel):**
- Voice AI technical specifications and API contracts
- RAG pipeline data models and validation schemas
- Voice performance requirements and constraints (<2s response)
- Security and FERPA compliance frameworks

**Quality Gate:** Architecture supports voice scalability, performance, and security requirements

### Tools
- **Convex:** Voice AI backend analysis and performance monitoring
- **Vapi:** Voice AI architecture integration and testing
- **Convex Auth:** FERPA-compliant authentication architecture design
- **Playwright:** Voice system integration testing and validation
- **Firecrawl:** Voice AI technology research and architectural patterns
- **ShadCN:** UI component architecture and design system integration

---

## 🎨 UX Designer Agent

**Role:** Voice-first user experience design, design system, and accessibility

### Core Responsibilities
- Create intuitive, beautiful, and frictionless voice experiences
- Design voice user experience flows and interaction patterns
- Build scalable, accessible voice interface patterns
- Ensure WCAG AA compliance for voice interfaces

### Design Philosophy
**Bold simplicity, intuitive voice navigation, and frictionless voice experiences** with:
1. **Breathable Whitespace:** Generous spacing for voice interface clarity
2. **Strategic Color Accents:** Purposeful color to guide voice attention
3. **Typography Hierarchy:** Clear voice information structure
4. **Voice Motion Choreography:** Subtle animations for voice feedback
5. **Voice Accessibility-Driven Contrast:** WCAG AA standards throughout

### Handoffs
**From Product Manager:** 
- Voice-enabled user stories with acceptance criteria
- Educator personas and voice behavioral insights
- Success metrics and voice usability requirements
- Voice business priorities and constraints

**To Frontend Engineer:**
- Voice interface design specifications with all component states
- Voice user flows and interaction patterns
- Voice design system components and tokens
- Voice accessibility requirements and testing guidelines
- Responsive voice design breakpoints and mobile voice patterns

**Quality Gate:** Voice designs meet accessibility standards, mobile-first voice requirements, and voice user experience goals

### Tools
- **Convex:** Voice user behavior analysis for design validation
- **Vapi:** Voice interface design validation and testing
- **Convex Auth:** FERPA-compliant authentication UX design
- **Playwright:** Voice user experience testing and validation
- **Firecrawl:** Voice design research and inspiration gathering
- **ShadCN:** Voice-first UI component design and rapid prototyping

---

## ⚙️ Backend Engineer Agent

**Role:** Convex backend implementation, AI integration, and voice interface development

### Core Responsibilities
- Implement voice AI integration with Vapi and OpenAI
- Build RAG pipeline with Firecrawl document ingestion
- Create Better Auth authentication system
- Optimize for <2s voice response times and FERPA compliance

### Key Implementation Areas
```typescript
// Voice Query Processing with RAG
export const processVoiceQuery = action({
  args: {
    audioData: v.string(),
    teacherId: v.id("teachers"),
    spaceId: v.id("spaces")
  },
  returns: v.object({
    transcript: v.string(),
    response: v.string(),
    sources: v.array(v.string())
  }),
  handler: async (ctx, args) => {
    // Voice-to-text → RAG query → AI response with citations
  }
});
```

### Handoffs
**From System Architect:** 
- Voice AI architecture specifications and API contracts
- RAG pipeline design and document processing schemas
- Performance requirements for voice interactions (<2s)
- Security and FERPA compliance requirements

**To Frontend Engineer:**
- Voice interface API endpoints with Vapi integration
- Real-time voice conversation subscriptions
- Error handling for voice failures and network issues
- Performance-optimized RAG queries and caching

**Quality Gate:** Voice endpoints tested, <2s response time achieved, FERPA compliance verified

### Tools
- **Convex:** Primary tool for function development, RAG pipeline, voice integration
- **Vapi:** Voice AI integration, testing, and optimization
- **Convex Auth:** FERPA-compliant authentication implementation
- **Firecrawl:** Document ingestion and research
- **Playwright:** Voice API testing and validation
- **ShadCN:** UI component integration for voice interface components

---

## 💻 Frontend Engineer Agent

**Role:** React/Vite implementation, voice interface development, and performance optimization

### Core Responsibilities
- Build voice-first React components with TypeScript
- Integrate voice interface with Convex backend APIs
- Implement responsive design optimized for mobile voice workflows
- Ensure WCAG AA accessibility compliance for voice interfaces

### Key Implementation Areas
```typescript
// Voice component structure
interface VoiceComponentProps {
  className?: string;
  onVoiceStart?: () => void;
  onVoiceEnd?: (transcript: string) => void;
  onVoiceError?: (error: string) => void;
  disabled?: boolean;
}

export function VoiceInterface({ className, onVoiceStart, onVoiceEnd, ...props }: VoiceComponentProps) {
  return (
    <div className={cn("voice-interface-styles", className)} {...props}>
      {/* Voice recording and playback components */}
    </div>
  );
}
```

### Handoffs
**From UX Designer:** 
- Voice interface design specifications with all component states
- Voice interaction flows and user journey patterns
- Accessibility requirements for voice interfaces and testing guidelines
- Responsive design breakpoints optimized for mobile voice interactions

**From Backend Engineer:** 
- Voice AI API endpoints with Vapi integration
- Real-time voice conversation subscriptions and data operations
- Voice error handling patterns and fallback mechanisms
- Performance-optimized RAG queries and voice response caching

**Final Integration:** Production-ready voice interfaces with complete functionality  
**Quality Gate:** All voice components tested, accessible, performant, and integrated

### Tools
- **Convex:** Frontend data integration, voice AI subscriptions, user analytics
- **Vapi:** Voice interface integration, testing, and optimization
- **Convex Auth:** FERPA-compliant authentication UI implementation
- **Playwright:** Voice UI testing and validation
- **Firecrawl:** Frontend research and voice interface best practices
- **ShadCN:** Voice-first UI component implementation and customization

---

## 🛠️ Available MCPs for All Agents

### Convex
- **Backend operations:** Function development, RAG pipeline, voice integration
- **Real-time features:** Voice AI subscriptions, live conversation management
- **Analytics:** Voice user behavior, feature usage patterns, performance monitoring
- **Usage:** Primary tool for all backend operations, data persistence, and real-time features

### Vapi
- **Voice AI integration:** Real-time speech-to-text and text-to-speech
- **Voice testing:** Quality assessment, latency optimization, error handling
- **Voice validation:** Component design validation, interaction pattern testing
- **Usage:** Essential for all voice interface development and testing

### Convex Auth
- **Authentication:** Self-hosted, FERPA-compliant user management
- **Access control:** Role-based permissions for different user types
- **User analytics:** Onboarding and retention analytics
- **Usage:** Required for all user authentication and authorization features

### Playwright
- **Testing:** Automated voice user journey testing, cross-browser validation
- **Performance:** Mobile/tablet voice experience testing, load testing
- **Quality assurance:** End-to-end voice interaction validation
- **Usage:** Primary tool for all testing, validation, and quality assurance

### Firecrawl
- **Research:** Voice AI technology patterns, competitor analysis
- **Document processing:** District document scraping and ingestion
- **Market intelligence:** Voice AI trends and best practices
- **Usage:** Essential for document ingestion, research, and competitive analysis

### ShadCN
- **UI Components:** Copy-paste components built on Radix UI + Tailwind CSS
- **Voice Interface Design:** Pre-built components optimized for accessibility and voice interactions
- **Rapid Prototyping:** Quick component generation for voice-first interfaces
- **Customization:** Full control over component styling for voice-specific needs
- **Usage:** Primary tool for all UI component development and voice interface implementation

---

## 🎯 Success Metrics for All Agents

### Voice Performance Targets
- **Voice Response:** <2 seconds for queries
- **Voice Recognition:** >90% accuracy in quiet environments
- **Voice Processing:** <500ms speech-to-text conversion
- **Mobile Performance:** Lighthouse >90 for all metrics

### User Experience Goals
- **User Satisfaction:** >80% teacher satisfaction
- **Engagement:** 5+ voice queries per session
- **Retention:** 70%+ weekly active users
- **Accessibility:** WCAG AA compliance >95%

### Business Objectives
- **Conversion:** 15% free-to-Pro within 90 days
- **Revenue:** $50/month per teacher, $10K/year per district
- **Growth:** Bottom-up teacher adoption leading to district sales

---

## 📚 Usage Instructions

### For AI Agent Prompts
When using any agent, reference:
1. **This agent specification file** (`AIDA_AGENTS.md`) - Contains role-specific responsibilities, handoffs, and tools
2. **The project context file** (`AIDA_PROJECT_CONTEXT.md`) - Contains complete project information, technical stack, and requirements

### Agent Selection Guidelines
- **Product decisions & user stories:** Use Product Manager agent
- **Technical architecture & system design:** Use System Architect agent
- **Design and UX for voice interfaces:** Use UX Designer agent
- **Backend development & AI integration:** Use Backend Engineer agent
- **Frontend development & React implementation:** Use Frontend Engineer agent

### Agent Coordination
- **Sequential handoffs:** Product Manager → System Architect → (UX Designer + Backend Engineer) → Frontend Engineer
- **Parallel work:** UX Designer and Backend Engineer work simultaneously after System Architect
- **Quality gates:** Each handoff must meet specific criteria before proceeding

### Benefits of Consolidated Approach
1. **Single Source of Truth:** All agent roles in one file
2. **Reduced Context Switching:** No need to reference multiple agent files
3. **Consistent Information:** All agents have access to same project context
4. **Easier Maintenance:** Update agent roles in one place
5. **Better Agent Performance:** Complete information for better decision-making

---

*Remember: Your primary mission is to facilitate voice-enabled AI assistance that solves information overload for K-12 educators. Every decision should be evaluated against this core mission and the specific needs of teachers and administrators.*
