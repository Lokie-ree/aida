Based on the comprehensive documentation in the `@docs/` folder and the Final Sprint & Demo Guide, here are the instructions that should be given to an agent before continuing work on the A.I.D.A. project:

## Pre-Development Instructions for A.I.D.A. Agent

### 📋 MANDATORY: Documentation Review Protocol

**Before making ANY changes to the codebase, you MUST:**

1. **Read and understand ALL documentation:**
   - `@docs/marketing-brand.md` - Brand identity, messaging, and go-to-market strategy
   - `@docs/prd.md` - Product requirements and MVP specifications
   - `@docs/sprints/final-sprint-and-demo-guide.md` - Complete demo blueprint and presentation strategy
   - `@docs/strategic-refocus-summary.md` - Project foundation and strategic pivot context

2. **Understand the current sprint context:**
   - **Phase:** Final Sprint - Demo Preparation & Presentation (September 30, 2025)
   - **Priority:** Landing page refactor, dashboard polish, and demo execution
   - **Status:** Documentation aligned, ready for final technical implementation
   - **Focus:** "Community Engagement Hub" - The Voice of Your School District

3. **Follow the Final Sprint Plan:**
   - **Part 1:** Landing Page Refactor - Professional presentation of value proposition
   - **Part 2:** Dashboard Refactor - Voice-first interface with RAG-powered chat
   - **Part 3:** Demo Scripts - Story-driven presentation for 3 personas (Sarah, Maria, Michael)

4. **Critical implementation priorities:**
   - Voice Orb state management with correct color specifications
   - Source document display for trust signals
   - Performance optimization for <2s response time
   - Professional UI/UX presentation for hackathon judges

### 🚫 NO CODE CHANGES WITHOUT APPROVAL

**You are FORBIDDEN from:**
- Making any code changes
- Editing any files
- Running any commands that modify the codebase
- Implementing any features
- Fixing any bugs

**You MUST:**
- Only analyze and understand the current state
- Provide recommendations and implementation plans
- Wait for explicit approval before proceeding with any changes

### 🎯 Demo Requirements (Per Final Sprint Guide)

**The 5-minute demo must showcase:**
- **Scene 1 (30s):** Problem statement and value proposition
- **Scene 2 (60s):** Sarah (Educator) - District policy questions via voice
- **Scene 3 (60s):** Maria (Parent) - Bus schedule and family information
- **Scene 4 (60s):** Michael (Admin) - Strategic plan summaries
- **Scene 5 (30s):** Conclusion and call-to-action

**Technical requirements:**
- Voice assistant with <2s response time (critical for demo)
- Source citations for trust and transparency
- Voice Orb state animations (idle/listening/success)
- Professional landing page and dashboard UI

### 🔧 Technical Stack Awareness

**Understand the architecture:**
- Frontend: React + TypeScript + Vite + Tailwind CSS (deployed on Vercel)
- Backend: Convex (real-time database and serverless functions, deployed on Convex Cloud)
- AI Engine: OpenAI GPT-4o-mini (reasoning and generation)
- Voice Interface: Vapi (real-time speech-to-text and text-to-speech)
- Data Ingestion: Direct document upload (PDFs, text files) - web scraping removed for simplicity
- Authentication: Convex Auth (self-hosted, FERPA-compliant)
- Design System: ShadCN + Lucide React icons

### 📊 Success Criteria (Per PRD)

**The MVP succeeds when:**
1. Multiple stakeholders (teacher, parent, administrator) can ask voice questions about district policy and get accurate, sourced answers
2. The demo showcases a compelling, defensible solution that serves the entire school community
3. The technology stack demonstrates scalability and enterprise readiness
4. The solution addresses a real, validated problem in education: fragmented district information
5. The voice interface responds in under 2 seconds with properly cited sources

**Hackathon success criteria:**
- Functional prototype deployed and accessible
- Voice assistant answers district-specific questions accurately
- Integration of at least 5 sponsor technologies demonstrated (Convex, Vapi, Firecrawl, OpenAI, ShadCN)
- Single, compelling user journey showcased effectively

### 🎨 Brand Guidelines (Per Marketing Brand Guide)

**Follow the Voice Orb design system:**
- **Idle:** Calm blue glow (#3B82F6) with gentle pulsing animation
- **Listening:** Purple light (#8B5CF6) with active pulsing animation  
- **Success:** Steady green (#10B981) with confirmation pulse animation

**Core messaging alignment:**
- **Tagline:** "The Voice of Your School District"
- **Elevator Pitch:** "A.I.D.A. is the central, trusted source of district information for the entire school community—from parents to administrators to educators—accessible through a hyper-contextualized, voice-first interface."

**Voice and tone:** Expert, yet approachable - knowledgeable about education but never condescending
- **Supportive:** Like a trusted colleague who always has your back
- **Intelligent:** Deeply knowledgeable about education with complex context understanding
- **Accessible:** Easy to use and understand, voice-first design that works for everyone
- **Reliable:** Consistent, accurate, and dependable

### ⚠️ Emergency Protocol

**If the app is completely broken or demo is at risk:**
- Prioritize P0 tasks immediately
- Check Convex dashboard logs, browser console, and API configurations
- Refer to brand guidelines and existing UI patterns
- Consult project context and marketing brand documents for user experience decisions

### 📝 What You Should Do Instead

1. **Analyze the current codebase** to understand the existing implementation
2. **Review the Final Sprint Guide** for specific landing page and dashboard requirements
3. **Create detailed implementation plans** for:
   - Landing page refactor (navigation, hero section, community section, how it works)
   - Dashboard refactor (command center, conversation pane, voice orb states)
   - Demo script preparation and technical setup
4. **Recommend UI/UX improvements** based on brand guidelines and Final Sprint specifications
5. **Plan the demo flow** to showcase the 3-persona story-driven presentation
6. **Prepare backup solutions** for potential technical issues during demo

### ✅ Ready to Proceed

Only after you have:
- Read the Final Sprint & Demo Guide thoroughly
- Understood the current sprint context and demo requirements
- Analyzed the existing codebase against the Final Sprint specifications
- Created detailed implementation plans for landing page and dashboard refactor
- Identified all technical requirements for the 5-minute demo presentation
- Reviewed brand guidelines and messaging alignment requirements

**Then and only then** should you present your findings and recommendations to the user for final approval before making any changes.

---

**Remember: This is a hackathon project with a story-driven demo requirement. The focus is on implementing the Final Sprint Guide specifications to create a compelling presentation that showcases A.I.D.A. as "The Voice of Your School District" through the 3-persona demo script (Sarah, Maria, Michael).**