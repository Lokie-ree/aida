import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedInitialFrameworks = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    // Use admin user ID (Better Auth manages the actual user)
    const adminUserId = "admin";

    // Seed AI Basics Hub frameworks
    const aibFrameworks = [
      {
        frameworkId: "AIB-001",
        title: "Email Drafting for Parent Communication",
        module: "ai-basics-hub" as const,
        category: "teacher-productivity",
        tags: ["email", "parent-communication", "productivity"],
        challenge: "Drafting a sensitive email to a parent about a student's struggles can be time-consuming and emotionally taxing.",
        solution: `1. Open your preferred AI platform (MagicSchool AI, Brisk, SchoolAI, Gemini, etc.)
2. Use the prompt template below, filling in the specific details
3. Review the AI-generated draft carefully
4. Personalize the message with your voice and specific observations
5. Ensure it reflects your professional judgment and the student's context`,
        samplePrompt: `Act as a compassionate and professional [grade level] [subject] teacher. Draft an email to a parent, [Parent's Name], about their child, [Student's Name]. The tone should be supportive but clear.

**Context:**
- Student: [Student's Name]
- Strength: [Positive observation about the student]
- Challenge: [Specific academic or behavioral struggle]
- Goal: Schedule a brief phone call to discuss a support plan.

Please provide a subject line and the body of the email.`,
        ethicalGuardrail: "AI is a drafting assistant. The final message, professional judgment, and accountability are always yours. Never send an AI-generated email without ensuring it reflects your voice and the specific student's context.",
        tipsAndVariations: "For urgent situations, start with a phone call. For positive news, consider adding a specific example of recent success.",
        timeEstimate: 10,
        difficultyLevel: "beginner" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 4: Professional Responsibilities"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
        averageRating: undefined,
        averageTimeSaved: undefined,
      },
      {
        frameworkId: "AIB-002",
        title: "Newsletter Generation and Templates",
        module: "ai-basics-hub" as const,
        category: "teacher-productivity",
        tags: ["newsletter", "communication", "productivity"],
        challenge: "Creating engaging weekly or monthly newsletters takes valuable planning time away from instruction.",
        solution: `1. Gather key information: upcoming events, student achievements, curriculum focus
2. Open your AI platform
3. Use the newsletter prompt template
4. Review and customize the generated content
5. Add personal touches and specific student/class examples
6. Format in your preferred newsletter tool`,
        samplePrompt: `Act as an experienced [grade level] [subject] teacher creating a newsletter for parents.

**Information to include:**
- Week/Month: [Date range]
- Curriculum Focus: [What students are learning]
- Upcoming Events: [List 2-3 events]
- Student Achievements: [Highlight 1-2 achievements]
- Reminders: [Any important reminders]
- How Parents Can Help: [1-2 specific suggestions]

Create an engaging, positive newsletter (300-400 words) with clear sections and a warm, professional tone.`,
        ethicalGuardrail: "Always review AI-generated content for accuracy. Ensure all dates, events, and student information are correct before sending. Never include student names without permission.",
        tipsAndVariations: "Save successful prompts as templates. Adjust tone for different grade levels. Consider adding a 'Student Spotlight' section.",
        timeEstimate: 15,
        difficultyLevel: "beginner" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 4: Professional Responsibilities"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "AIB-003",
        title: "Document Summarization for Professional Reading",
        module: "ai-basics-hub" as const,
        category: "teacher-productivity",
        tags: ["summarization", "professional-development", "reading"],
        challenge: "Keeping up with educational research and policy documents is essential but time-consuming.",
        solution: `1. Upload or paste the document into your AI platform
2. Use the summarization prompt below
3. Review the key points and action items
4. Save the summary for future reference
5. Share key insights with colleagues if appropriate`,
        samplePrompt: `Please summarize this educational document for a [grade level] [subject] teacher. Focus on:

**Key Points:**
- Main arguments or findings
- Practical applications for classroom use
- Louisiana-specific implications if relevant

**Action Items:**
- What should I implement in my classroom?
- What questions should I ask my administrator?
- What resources do I need to explore further?

**Time to Implement:**
- Quick wins (this week)
- Medium-term changes (this month)
- Long-term planning (this semester)

Document: [Paste document text here]`,
        ethicalGuardrail: "AI summaries are starting points for understanding. Always verify important information by reading the original source, especially for policy or legal matters.",
        tipsAndVariations: "Use this for curriculum guides, research papers, and district memos. Create a personal knowledge base by saving summaries.",
        timeEstimate: 8,
        difficultyLevel: "beginner" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 4: Professional Responsibilities"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "AIB-004",
        title: "Meeting Notes and Action Item Extraction",
        module: "ai-basics-hub" as const,
        category: "teacher-productivity",
        tags: ["meetings", "notes", "action-items"],
        challenge: "Capturing key decisions and action items from faculty meetings, PLCs, and professional development sessions.",
        solution: `1. Record or transcribe meeting notes
2. Paste into your AI platform
3. Use the extraction prompt below
4. Review and organize the action items
5. Share with team members if needed`,
        samplePrompt: `Extract key information from these meeting notes for a [subject] teacher:

**Meeting Details:**
- Date: [Date]
- Attendees: [List key participants]
- Meeting Type: [Faculty meeting, PLC, PD, etc.]

**Key Decisions:**
- What was decided?
- Who is responsible?
- What are the deadlines?

**Action Items for Me:**
- What do I need to do?
- When is it due?
- What resources do I need?

**Important Information:**
- Policy changes
- Upcoming events
- Resources shared

Meeting Notes: [Paste notes here]`,
        ethicalGuardrail: "AI helps organize information but doesn't replace active listening. Always verify important decisions and deadlines with meeting organizers.",
        tipsAndVariations: "Use this for PLC notes, faculty meetings, and professional development sessions. Create follow-up reminders for action items.",
        timeEstimate: 5,
        difficultyLevel: "beginner" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 4: Professional Responsibilities"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "AIB-005",
        title: "Professional Email Responses",
        module: "ai-basics-hub" as const,
        category: "teacher-productivity",
        tags: ["email", "professional-communication", "responses"],
        challenge: "Crafting professional, helpful responses to parent emails, colleague requests, and administrative communications.",
        solution: `1. Read the incoming email carefully
2. Identify the key points and tone
3. Use the response prompt template
4. Review and personalize the draft
5. Send with confidence`,
        samplePrompt: `Help me draft a professional response to this email as a [grade level] [subject] teacher:

**My Role:** [Your position and responsibilities]
**Tone:** [Professional, helpful, firm, etc.]
**Key Points to Address:** [List main points to cover]

**Incoming Email:**
[Paste the email you're responding to]

**Response Requirements:**
- Acknowledge their concern/request
- Provide clear information or next steps
- Maintain professional boundaries
- Offer additional support if appropriate
- Keep it concise but complete`,
        ethicalGuardrail: "AI helps with tone and structure, but your professional judgment and knowledge of school policies are essential. Always review before sending.",
        tipsAndVariations: "Use this for parent concerns, colleague requests, and administrative communications. Save successful templates for similar situations.",
        timeEstimate: 7,
        difficultyLevel: "beginner" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 4: Professional Responsibilities"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
    ];

    // Seed Instructional Expert Hub frameworks
    const iehFrameworks = [
      {
        frameworkId: "IEH-001",
        title: "Unpacking Louisiana State Standards",
        module: "instructional-expert-hub" as const,
        category: "louisiana-framework",
        tags: ["standards", "lesson-planning", "louisiana"],
        challenge: "Breaking down complex Louisiana state standards into clear, measurable learning objectives takes significant time and expertise.",
        solution: `1. Identify the specific Louisiana standard you're addressing
2. Open your AI platform
3. Use the standards unpacking prompt
4. Review the generated objectives and success criteria
5. Align with your curriculum and student needs
6. Refine based on your professional judgment`,
        samplePrompt: `Act as a Louisiana curriculum specialist. Analyze this Louisiana state standard and help me unpack it for lesson planning:

**Standard:** [Paste full standard here]
**Grade Level:** [Grade]
**Subject:** [Subject]

Please provide:
1. A clear explanation of what this standard means in student-friendly language
2. Three differentiated "I can" statements (approaching, meeting, exceeding)
3. Key vocabulary students need to understand
4. Potential misconceptions students might have
5. Suggested formative assessment strategies`,
        ethicalGuardrail: "AI can help unpack standards, but your professional judgment determines how to teach them. Always verify alignment with Louisiana's official curriculum documents and your district's scope and sequence.",
        tipsAndVariations: "Use this for unit planning. Create anchor charts from the 'I can' statements. Share unpacked standards with students at the start of units.",
        timeEstimate: 20,
        difficultyLevel: "intermediate" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: ["All Louisiana State Standards"],
        lerDomains: ["Domain 1: Planning and Preparation"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "IEH-002",
        title: "Creating Standards-Aligned 'I Can' Statements",
        module: "instructional-expert-hub" as const,
        category: "louisiana-framework",
        tags: ["standards", "i-can-statements", "student-friendly"],
        challenge: "Translating complex standards into student-friendly 'I can' statements that guide learning and assessment.",
        solution: `1. Start with your unpacked Louisiana standard
2. Use the 'I can' statement prompt
3. Generate multiple levels of complexity
4. Review for clarity and age-appropriateness
5. Create visual displays for your classroom`,
        samplePrompt: `Create student-friendly "I can" statements for this Louisiana standard:

**Standard:** [Paste standard here]
**Grade Level:** [Grade]
**Subject:** [Subject]

**Requirements:**
- Use "I can" language
- Make it age-appropriate for [grade level]
- Include three levels: approaching, meeting, exceeding
- Focus on what students will DO, not what they will know
- Keep it specific and measurable

**Format:**
- Approaching: I can [basic skill/understanding]
- Meeting: I can [grade-level expectation]
- Exceeding: I can [advanced application/analysis]`,
        ethicalGuardrail: "These statements guide student learning and assessment. Ensure they accurately reflect the standard and are appropriate for your students' developmental level.",
        tipsAndVariations: "Use these for lesson objectives, exit tickets, and student self-assessment. Display them prominently in your classroom.",
        timeEstimate: 15,
        difficultyLevel: "intermediate" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: ["All Louisiana State Standards"],
        lerDomains: ["Domain 1: Planning and Preparation"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "IEH-003",
        title: "Anticipating Student Misconceptions",
        module: "instructional-expert-hub" as const,
        category: "instructional-design",
        tags: ["misconceptions", "lesson-planning", "differentiation"],
        challenge: "Identifying potential student misconceptions before teaching helps create more effective lessons and interventions.",
        solution: `1. Identify your lesson topic and grade level
2. Use the misconception analysis prompt
3. Review common misconceptions and their causes
4. Plan instructional strategies to address them
5. Create formative assessments to check for understanding`,
        samplePrompt: `Help me anticipate student misconceptions for this lesson:

**Topic:** [Lesson topic]
**Grade Level:** [Grade]
**Subject:** [Subject]
**Learning Objective:** [What students should understand]

**Please provide:**
1. 3-5 common misconceptions students might have
2. Why students typically develop these misconceptions
3. Instructional strategies to prevent each misconception
4. Questions to ask students to reveal misconceptions
5. Activities to help students correct their thinking`,
        ethicalGuardrail: "Misconceptions are natural part of learning. Use this information to support student understanding, not to judge or criticize their thinking.",
        tipsAndVariations: "Use this for new concepts, abstract ideas, and topics students typically struggle with. Create misconception journals for students to track their learning.",
        timeEstimate: 18,
        difficultyLevel: "intermediate" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 1: Planning and Preparation", "Domain 3: Instruction"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "IEH-004",
        title: "Creating Exemplar Work and Rubrics",
        module: "instructional-expert-hub" as const,
        category: "instructional-design",
        tags: ["rubrics", "exemplars", "assessment"],
        challenge: "Creating clear rubrics and exemplar work that help students understand expectations and improve their performance.",
        solution: `1. Define your assignment and learning objectives
2. Use the rubric creation prompt
3. Generate exemplar work at different levels
4. Review and refine the rubric
5. Create student-friendly versions`,
        samplePrompt: `Create a rubric and exemplar work for this assignment:

**Assignment:** [Describe the assignment]
**Grade Level:** [Grade]
**Subject:** [Subject]
**Learning Objectives:** [What students should demonstrate]

**Please provide:**
1. A 4-point rubric with clear criteria
2. Exemplar work at each level (1, 2, 3, 4)
3. Student-friendly language
4. Specific, observable criteria
5. Suggestions for improvement at each level`,
        ethicalGuardrail: "Rubrics should support learning, not just grading. Ensure they're clear, fair, and help students understand how to improve.",
        tipsAndVariations: "Use this for major assignments and projects. Have students help create rubrics to increase ownership and understanding.",
        timeEstimate: 25,
        difficultyLevel: "intermediate" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 1: Planning and Preparation", "Domain 2: Classroom Environment"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "IEH-005",
        title: "Designing Formative Assessment Strategies",
        module: "instructional-expert-hub" as const,
        category: "instructional-design",
        tags: ["formative-assessment", "instruction", "feedback"],
        challenge: "Creating effective formative assessments that provide timely feedback and guide instructional decisions.",
        solution: `1. Identify your learning objectives
2. Use the formative assessment prompt
3. Generate multiple assessment strategies
4. Plan for quick data collection and analysis
5. Create systems for providing feedback`,
        samplePrompt: `Design formative assessment strategies for this lesson:

**Topic:** [Lesson topic]
**Grade Level:** [Grade]
**Subject:** [Subject]
**Learning Objectives:** [What students should understand/do]

**Please provide:**
1. 3-5 quick formative assessment strategies
2. How to collect data efficiently
3. What to look for in student responses
4. How to use data to adjust instruction
5. Methods for providing immediate feedback`,
        ethicalGuardrail: "Formative assessment should inform teaching and learning, not just measure performance. Use data to support student growth, not to label or compare students.",
        tipsAndVariations: "Use this for new concepts and skills. Create a toolkit of quick assessment strategies you can use throughout lessons.",
        timeEstimate: 22,
        difficultyLevel: "intermediate" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 1: Planning and Preparation", "Domain 3: Instruction"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
    ];

    // Insert all frameworks
    for (const framework of [...aibFrameworks, ...iehFrameworks]) {
      await ctx.db.insert("frameworks", framework);
    }

    return null;
  },
});

// Admin user creation is handled by Better Auth
