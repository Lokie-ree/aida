# Product Requirements Document (PRD)

**Project:** A.I.D.A. (AI-powered Instructional District Assistant)  
**Version:** 2.0 (Hackathon Prototype, Revised)

## 1. Introduction
The A.I.D.A. project is a web-based, AI-driven command center designed for educators. It is driven by an authentic, student-first philosophy and a passion for being a creative builder. The project aims to streamline a teacher’s workflow and provide intelligent, contextual support by leveraging district-specific data and a suite of powerful technologies. The product's core purpose is to help teachers and students navigate a world rapidly evolving with AI, in a responsible and effective manner. This solution is strategically positioned to be a "Minimum Viable Product" (MVP) that is both compelling and defensible against the commoditization of basic AI features. The core strategy is to "go deep, not wide," by focusing on a high-need, under-prioritized niche: a tool that augments human expertise rather than attempting to replace it.
## 2. Goals
- To build an AI-powered instructional feedback system and a virtual assistant that serves the educational community.
- To create a tool that enhances human connection by automating workflows and personalizing support, freeing up educators' time.
- To demonstrate a strategic vision for the future of education where technology deepens learning and prepares all stakeholders for a rapidly evolving world.
- To move beyond basic automation (like the previous AppScript project) to a more robust, AI-driven solution using a modern tech stack.
- To create a functional prototype for a teacher command center that integrates district-specific context, addressing the problem of information overload for educators.

## 3. Audience
- **Primary Users:** K-12 educators
- **Secondary Users:** School district administrators

## 4. Key Features (MVP)
The project will focus on a single, compelling user journey to secure a winning demonstration, creating a "minimum lovable product".
### 4.1 The Teacher Command Center Dashboard

**Description:** A centralized dashboard that provides a quick overview of key tasks and insights.

**Purpose:** To serve as a single point of reference for educators, much like a command center. This feature aims to streamline educational workflows and improve outcomes for the entire community.

### 4.2 Context-Aware Virtual Assistant

**Description:** A real-time, voice-driven AI assistant that answers questions based on a specific school district's documents and curriculum.

**Purpose:** To provide personalized support and intelligent resource management by making district-specific information readily accessible. This directly aligns with the goal of building a virtual assistant to support educators.

**User Story:** "As a teacher, I want to ask the virtual assistant about the district's policy on student-led projects so I can properly guide my students".

### 4.3 AI-Powered Instructional Feedback

**Description:** A tool where teachers can upload a lesson plan or a prompt and receive intelligent, AI-generated feedback.

**Purpose:** To assist teachers in preparing for future employment opportunities and to help close educational gaps through personalized support. This is a core part of the mission to build AI-powered instructional feedback systems.

**User Story:** "As an educator, I want to submit my lesson plan to the assistant so it can suggest ways to enhance engagement or add a more rigorous component."

## 5. Technical Requirements
- **Platform:** A modern web application with a responsive user interface
- **Core Backend:** Convex will be used as the central, real-time database and backend for managing the application's state
- **Data Ingestion:** Firecrawl will be used to automatically scrape and ingest district-specific documents like curriculum standards, professional development materials, and student handbooks, converting raw HTML into clean, structured data
- **Knowledge Base:** The @convex-dev/rag component will build a searchable, private knowledge base from the ingested data, which will power the context-aware virtual assistant
- **AI Engine:** OpenAI will be used to analyze and generate instructional feedback and to power the conversational flow of the virtual assistant
- **User Authentication:** The Convex + Better Auth component will be implemented for secure user logins, providing enterprise-grade authentication with full data ownership
- **Communication:** The @convex-dev/resend component will be used to send automated email reports or updates. This component handles complexities like queueing and durable execution, ensuring reliability
- **Voice Integration:** Vapi will enable a voice interface for the virtual assistant, allowing for real-time, hands-free interaction. Vapi will handle the low-latency speech-to-text and text-to-speech conversion
- **Monetization:** While not a focus for the MVP, Autumn provides a clear path to monetization with minimal API calls for a future roadmap
- **Data Visualization:** Scorecard will be integrated to display key metrics on the dashboard

## 6. Success Metrics
- A functional prototype of the Teacher Command Center is built and deployed
- The AI-powered instructional feedback system can successfully analyze a test lesson plan and provide relevant suggestions
- The context-aware virtual assistant can accurately answer questions based on provided documents
- The project successfully integrates at least five of the sponsor technologies to demonstrate a cohesive, modern tech stack
- The MVP focuses on a single, compelling user journey to secure a winning demonstration

## 7. Future Scope (Out of Scope for Hackathon)
- Integration with student information systems (SIS) for automated student progress reports and data
- A student-facing version of the virtual assistant
- A collaborative feature for teachers to share and get feedback on lesson plans
- A mobile application for on-the-go access
- Implementing Autumn for a full-fledged usage-based monetization model
- Enhancing RAG capabilities to handle multi-document retrieval and semantic chunking
- Expanding into new features like automated quiz generation and adaptive learning paths

## Market Overview
The AI in EdTech market is experiencing explosive growth.

**Market Size:** The global market for AI in education was estimated to be between $2.21 billion and $5.88 billion in 2024, with projections soaring to over $90 billion by 2033, reflecting a Compound Annual Growth Rate (CAGR) of over 30%. This significant growth is driven by a strong demand for personalized learning, automated administrative tasks, and digital learning environments.

**Key Trends:** A.I.D.A. aligns with several major trends:

- **Personalized Learning:** This is a dominant market segment, with AI-driven platforms tailoring content to individual student needs
- **Cloud-Based Solutions:** The cloud segment holds a significant market share, favored for its scalability and cost-effectiveness. Your planned use of a cloud-based tech stack aligns perfectly with this
- **Administrative Automation:** Over half of schools and universities are already using AI for administrative tasks, which validates your initial work on attendance and progress reports

## Competitive Analysis
While your vision is unique, there are many established and emerging players in the market. Understanding their offerings will help you differentiate A.I.D.A.

### Direct Competitors

These tools offer similar AI-driven features for educators:

- **Khanmigo:** A well-known AI-powered teaching assistant from Khan Academy. It excels at lesson plan generation, rubric creation, and student grouping. A key differentiator for them is that it is free for teachers
- **MagicSchool AI:** This platform provides over 50 tools for teachers, including lesson planning, rubric generation, and report writing. It's highly focused on efficiency and streamlining common administrative tasks
- **TeacherMatic:** This tool is designed for various roles in education, from teachers to administrators. It offers a wide range of generators for creating lesson plans, quizzes, policies, and professional communications
- **Brisk Teaching:** A Chrome/Edge extension that helps teachers with curriculum, feedback, and differentiation. It's particularly strong in its ability to adapt online text for different reading levels and to provide high-quality, personalized feedback on student work

### Indirect Competitors

These are broader platforms that could be seen as alternatives:

- **Google Classroom, Schoology, etc.:** These learning management systems (LMS) are the existing "command centers" for teachers. They are not AI-first, but they have the user base and are beginning to integrate some AI features, making them a significant incumbent presence
- **FeedbackFruits and TeachFX:** These tools focus on specific aspects of instructional feedback. FeedbackFruits provides a system for scaling high-quality learning design, while TeachFX offers automated feedback on a teacher's classroom interactions, like their talk-time ratio

### A.I.D.A.'s Defensible Niche
The key to A.I.D.A.'s long-term potential lies in your proposed unique differentiators:

- **Hyper-Contextualization:** By leveraging Firecrawl and Inkeep, A.I.D.A. can provide a level of district-specific, "baked-in" context that general-purpose tools cannot. No other competitor currently offers a system that can be trained on a district's specific curriculum guides, policies, and professional development materials to provide truly tailored advice. This is your most significant competitive advantage

- **Voice Interface:** The use of Vapi for a real-time, voice-enabled assistant is a powerful and engaging feature. While some tools have text-based chatbots, a conversational voice interface adds a layer of accessibility and user experience that few, if any, of the competitors offer

- **Integrated Suite:** Most competitors focus on a specific task (e.g., lesson plans, grading, or communication). A.I.D.A. is designed as a cohesive command center that integrates these functions into a single, seamless workflow, reducing the need for teachers to jump between multiple tools

## Summary

In summary, the market is robust and growing, which indicates strong demand. While many tools are available, your focus on building a hyper-contextual, voice-enabled command center provides a clear and defensible niche. This is a solid foundation for a project that is not only a great hackathon entry but also a viable business in the future.
