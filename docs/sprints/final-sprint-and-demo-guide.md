# A.I.D.A. Final Sprint Plan & Demo Guide

**Date:** September 30, 2025  
**Objective:** Execute the strategic pivot to a "Community Engagement Hub." This document provides a complete blueprint for the landing page, dashboard UI, and the final hackathon demo script.

## Part 1: Landing Page Refactor

**Objective:** To create a compelling, professional landing page that clearly communicates the new vision of A.I.D.A. as "The Voice of Your School District."

### Layout & Component Breakdown

The landing page will be a single, scrollable page built with a modern, clean aesthetic.

### 1. Navigation Bar

**Layout:** A simple, fixed-top navigation bar with a slight background blur for a premium feel.

**Components:**
- **Left Side:** `div` containing the A.I.D.A. logo (the Voice Orb icon and "A.I.D.A." wordmark)
- **Right Side:** ShadCN Button with the text "Try the Live Demo". This will scroll the user down to the demo section or link to the dashboard

### 2. Hero Section

**Layout:** Full-width section with a clean background. Centered text content with a strong visual hierarchy.

**Components:**
- `h1` for the main headline
- `p` tag with a larger font size for the sub-headline
- ShadCN Button (large size) for the primary call-to-action
- A high-quality, clean visual of the refactored dashboard UI mock-up below the text

**Copy:**
- **Headline:** "The Voice of Your School District. Instantly."
- **Sub-headline:** "A.I.D.A. provides trusted, instant answers from official district documents for parents, educators, and administrators. Ask a question, get the right answer."
- **Button Text:** "Ask A.I.D.A. a Question"

### 3. Community Section ("For Everyone...")

**Layout:** A three-column grid. Each column is a self-contained card highlighting a persona.

**Components (per column):**
- ShadCN Card component
- `CardHeader` containing a Lucide icon (`Users` for parents, `Heart` for educators, `BarChart3` for administrators) and the `CardTitle`
- `CardContent` containing the descriptive text
- `CardFooter` containing an example query in a styled blockquote

**Copy:**

#### Column 1 (Parents):
- **Title:** "Clarity for Your Family"
- **Text:** "Stop searching through cluttered websites and old emails. Get instant, trusted answers to all your district questions about school policies, calendars, and enrollment."
- **Example Query:** *"What's the attendance policy for middle school?"*

#### Column 2 (Educators):
- **Title:** "Focus on Your Students"
- **Text:** "End the hunt for policy documents and curriculum guides. Ask A.I.D.A. anything about your district's policies and get instant, accurate answers—hands-free clarification on district procedures so you can spend more time teaching."
- **Example Query:** *"What are the requirements for student-led projects?"*

#### Column 3 (Administrators):
- **Title:** "Communication You Can Trust"
- **Text:** "Empower your entire community with a single source of truth. Ensure consistent, accurate information delivery to your entire community—reduce repetitive inquiries and ensure consistent, accurate messaging on everything from board policies to safety protocols."
- **Example Query:** *"Summarize our district's goals for technology integration."*

### 4. "How It Works" Section

**Layout:** A three-step process displayed visually with numbers and icons.

**Components (per step):**
- A `div` containing a styled number (1, 2, 3)
- A `h3` for the step title
- A `p` tag for the description

**Copy:**

1. **We Securely Index Your District's Documents.** We process the official handbooks, policies, and guides you provide to build a secure, private knowledge base.

2. **You Ask a Question in Plain Language.** Access district information hands-free through natural voice interactions—use our simple voice interface to ask what you need to know, just like talking to a helpful colleague.

3. **Receive an Instant, Sourced Answer.** A.I.D.A. finds the precise information in seconds and tells you exactly which document it came from, ensuring complete trust and transparency. Save hours of searching through documents and focus on what matters most.

## Part 2: Dashboard Refactor

**Objective:** To create a sleek, focused, and intuitive interface that centers entirely on the voice interaction and RAG-powered chat experience.

### Layout & Component Breakdown

A modern two-column layout on desktop, stacking to a single column on mobile.

### Column 1: Command Center (Left Side - Fixed Width)

**Layout:** A vertically oriented section that houses the core controls and context.

**Components:**

#### District Context Header:
- A `div` with flex properties
- Avatar component from ShadCN showing the district's logo
- `div` with two text elements:
  - `h2` for the District Name (e.g., "Plaquemine Parish Schools")
  - `p` tag for status: "Knowledge Base: Active"

#### The Voice Orb (The Main Event):
- A large, centered `div` containing your Voice Orb icon component

**State Management:** This is critical. The component's state must drive its visual appearance.

- `state: 'idle'`: CSS class for calm blue glow (#3B82F6) with gentle pulsing animation
- `state: 'listening'`: CSS class for purple light (#8B5CF6) with active pulsing animation
- `state: 'processing'`: A subtle loading spinner inside or around the orb
- `state: 'success'`: Flash green (#10B981) with confirmation pulse animation for 1-2 seconds before returning to idle

#### Source Documents List:
- ShadCN Card component
- `CardHeader` with `CardTitle` reading "Official Knowledge Base"
- `CardContent` containing a scrollable `div`
- Inside the scrollable area, map over your loaded documents and display each one. Use a simple component with a Lucide document icon (e.g., `FileText`, `BookOpen`) and the `fileName`. This is a crucial trust signal.

### Column 2: Conversation Pane (Right Side - Flexible Width)

**Layout:** This section takes the remaining width and is dedicated to the chat history.

**Components:**

#### Welcome Message / Empty State:
- When the chat is empty, display a centered component
- `div` containing the A.I.D.A. Voice Orb icon, a `h3` saying "Ask me anything about the district", and a `p` with example questions

#### Conversation History:
- A tall, scrollable `div` that automatically scrolls to the bottom on new messages
- **User Message Bubble:** A `div` styled as a chat bubble, aligned to the right. Simple, clean text
- **A.I.D.A. Response Card:**
  - A ShadCN Card component, aligned to the left, to give it more structure
  - `CardContent`: The response text generated by the AI. Format with markdown support for lists, bolding, etc.
  - `CardFooter`: A critical component for trust. It should contain: `Source: [Document Name]` (e.g., "Student Handbook 2025.pdf"). This text should be a subtle, smaller font

#### Text Input Fallback:
- A `div` at the very bottom of the pane
- ShadCN Input component for typing a message
- ShadCN Button with a Lucide "Send" icon. This provides an alternative to voice

## Part 3: Detailed User Persona Scripts for Demo

**Objective:** To execute a compelling, story-driven demo that showcases the multi-stakeholder value of A.I.D.A. in under 5 minutes.

### Scene 1: The Problem (30 seconds)

*(Presenter starts with the Landing Page on screen)*

**Presenter:** "Good morning. We all know that school districts run on information. But for parents, teachers, and even administrators, finding the right information at the right time is a constant struggle. It's buried in websites, lost in emails, and locked away in dense PDF handbooks. This creates confusion, wastes time, and leads to frustration for the entire school community. A.I.D.A. solves this. A.I.D.A. is the central, trusted source of district information for the entire school community—from parents to administrators to educators—accessible through a hyper-contextualized, voice-first interface."

*(Presenter clicks "Ask A.I.D.A. a Question" and transitions to the Dashboard UI)*

### Scene 2: The Educator - Sarah (60 seconds)

**Presenter:** "Let's meet Sarah. She's a 7th-grade teacher preparing for her next class. A student has just asked about the policy for reporting bullying, and she needs an immediate, official answer. Instead of digging through a staff portal, she just asks A.I.D.A."

*(Presenter clicks the Voice Orb. It turns purple and pulses.)*

**Presenter (as Sarah, in a clear voice):** "What is our district's official policy for a student reporting a bullying incident?"

*(The Orb shows a brief processing state, then flashes green. The A.I.D.A. Response Card appears.)*

**Presenter:** "In less than two seconds—meeting our critical performance requirement—A.I.D.A. provides a direct answer, synthesized from the student handbook. Notice the source citation at the bottom—'Student Handbook 2025.pdf'. This isn't a guess; it's the verified district policy. Sarah now has the confidence to support her student correctly, and she never had to leave her workflow. This is exactly what we mean by 'Ask A.I.D.A. anything about your district's policies and get instant, accurate answers.'"

### Scene 3: The Engaged Parent - Maria (60 seconds)

**Presenter:** "Now, let's consider Maria, a parent getting her kids ready for school. She's unsure about the bus schedule. The district website is confusing, and the school office isn't open yet. She accesses A.I.D.A. through the district's public portal."

*(Presenter clears the chat history for the next demo.)*

*(Presenter clicks the Voice Orb.)*

**Presenter (as Maria):** "What time does the bus arrive at the corner of Maple Street and Oak Avenue?"

*(The Orb processes and responds.)*

**Presenter:** "A.I.D.A. instantly pulls the exact time from the 'Transportation Guide'—delivering the answer in under 2 seconds as designed. For Maria, this is a game-changer. She gets instant, trusted answers to all her district questions without having to call the school office or search multiple websites. This builds a better connection between her family and the school."

### Scene 4: The District Leader - Michael (60 seconds)

**Presenter:** "Finally, let's look at Michael, the district superintendent. He's heading into an unexpected board meeting and needs to brief himself on the district's strategic goals for technology. He doesn't have time to read the full 50-page plan."

*(Presenter clears the chat and clicks the Voice Orb.)*

**Presenter (as Michael):** "Summarize our student wellness goals from the strategic plan."

*(The Orb processes and responds with a concise, bulleted summary.)*

**Presenter:** "A.I.D.A. delivers a perfect, actionable summary, pulled directly from the 'District Strategic Plan.' Michael is now prepared and confident for his meeting. This demonstrates how A.I.D.A. ensures consistent, accurate information delivery to your entire community—the same system that helps a parent with a bus schedule can also provide high-level strategic insights to leadership."

### Scene 5: Conclusion (30 seconds)

**Presenter:** "A.I.D.A. ensures that every member of the school community—from a parent at home to a teacher in the classroom to the superintendent—has instant, reliable access to the information they need. It's not another suite of tools; it's a new foundation for communication. It is the voice of your district. Thank you."
