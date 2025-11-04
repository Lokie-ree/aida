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
      {
        frameworkId: "IEH-006",
        title: "Multi-Standard Unit Planning Framework",
        module: "instructional-expert-hub" as const,
        category: "louisiana-framework",
        tags: ["unit-planning", "standards", "differentiation", "ler-alignment", "time-saving"],
        challenge: "Planning a comprehensive unit aligned to multiple Louisiana standards while differentiating for diverse learners and meeting LER rubric expectations is an overwhelming task that can take hours. Between unpacking standards, creating objectives, planning differentiation, and aligning assessments, unit planning becomes a weekend-consuming burden that steals time from actual instruction.",
        solution: `1. Gather your standards: Identify 3-5 Louisiana standards for the unit
2. Open your preferred AI platform (MagicSchool AI, Gemini, SchoolAI, ChatGPT, etc.)
3. Use this comprehensive unit planning prompt (copy complete prompt below)
4. Generate full unit framework in one session
5. Review and refine based on your curriculum materials and student needs
6. Break down into daily lesson plans using the unit framework as your guide
7. Align each lesson to specific LER domains for evaluation readiness

This framework saves 30-45 minutes per unit by consolidating multiple planning tasks into one structured AI session.`,
        samplePrompt: `Act as an expert Louisiana curriculum specialist and instructional designer. I'm planning a comprehensive unit and need your guidance to create a complete unit framework aligned to Louisiana standards and the Louisiana Educator Rubric.

**UNIT CONTEXT:**
- **Subject:** [Subject area - e.g., English Language Arts, Mathematics, Science]
- **Grade Level:** [Grade level]
- **Unit Duration:** [X weeks]
- **Unit Title:** [Unit name/theme]

**LOUISIANA STANDARDS FOR THIS UNIT:**
[Paste all 3-5 Louisiana state standards you're addressing in this unit. Include full standard text, not just codes.]

**STUDENT CONTEXT:**
- **Needs:** [Brief description of your students' needs - e.g., diverse reading levels, English learners, students with IEPs]
- **Prior Knowledge:** [What students should already know]
- **End Goal:** [What students should be able to do by unit end]

**CREATING COMPREHENSIVE UNIT FRAMEWORK:**

**PART 1: STANDARDS UNPACKING & ALIGNMENT**
For each standard, provide:
1. Clear explanation in student-friendly language
2. Three differentiated "I can" statements (approaching grade level, meeting grade level, exceeding grade level)
3. Key vocabulary students must master
4. Prerequisite skills/concepts
5. Connection to LER Domain 1 (Planning and Preparation)

**PART 2: UNIT STRUCTURE & PACING**
Create:
1. Unit timeline broken into weekly goals
2. Essential questions that guide student inquiry
3. Unit learning objectives aligned to standards
4. Culminating assessment/performance task description
5. Daily learning targets for each week

**PART 3: DIFFERENTIATION STRATEGY**
Design:
1. Pre-assessment to identify student readiness levels
2. Three-tiered differentiation plan:
   - **Tier 1 (Approaching):** Scaffolds and supports for students below grade level
   - **Tier 2 (Meeting):** Grade-level activities and expectations
   - **Tier 3 (Exceeding):** Extensions and challenges for advanced learners
3. Accommodations for students with IEPs or English learners
4. Multiple means of representation, engagement, and expression

**PART 4: ASSESSMENT PLAN**
Develop:
1. Formative assessments for each week (quick checks for understanding)
2. Summative assessment plan aligned to standards
3. Rubric criteria for culminating task
4. Student self-assessment and reflection opportunities
5. Parent communication plan for unit progress

**PART 5: RESOURCE & MATERIAL IDENTIFICATION**
Identify:
1. LDOE resources relevant to these standards
2. High-quality texts, media, or materials needed
3. Technology integration opportunities
4. Real-world connections relevant to Louisiana students

**PART 6: LER RUBRIC ALIGNMENT**
Demonstrate alignment to:
- **Domain 1 (Planning and Preparation):** Standards alignment, knowledge of students, instructional outcomes
- **Domain 3 (Instruction):** Questioning techniques, engagement strategies, assessment integration
- **Domain 4 (Professional Responsibilities):** Communication with families, professional development connections

**OUTPUT FORMAT:**
Present this as a comprehensive, usable unit planning document that I can immediately reference for lesson planning, parent communication, and evaluation readiness.

**CRITICAL REQUIREMENTS:**
- All activities must be Louisiana-specific or adaptable to Louisiana context
- Differentiation must meet needs of diverse Louisiana learners
- Assessment must align with Louisiana testing expectations
- Language must be appropriate for [grade level] students
- Framework must save me significant planning time while maintaining quality

Please create this complete unit framework now.`,
        ethicalGuardrail: "This framework accelerates unit planning but your professional judgment, knowledge of your students, and alignment with your district's curriculum are essential. Always review AI-generated content for accuracy, appropriateness, and alignment with Louisiana's official documents. This is a planning assistant, not a replacement for your expertise.",
        tipsAndVariations: "Use this framework at the start of each unit for maximum time savings. Keep generated unit frameworks as templates for future years. Share with PLC teams for collaborative planning. Break the output into daily lesson plans using the weekly targets as your guide. Update framework with actual student data as unit progresses.",
        timeEstimate: 35,
        difficultyLevel: "advanced" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: ["All Louisiana State Standards"],
        lerDomains: ["Domain 1: Planning and Preparation", "Domain 3: Instruction", "Domain 4: Professional Responsibilities"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "IEH-007",
        title: "Louisiana LEADS Aligned Assessment Builder",
        module: "instructional-expert-hub" as const,
        category: "louisiana-framework",
        tags: ["assessment", "leads", "differentiation", "evaluation", "louisiana"],
        challenge: "Creating differentiated assessments that align with Louisiana LEADS framework expectations, meet diverse learner needs, and demonstrate educator effectiveness for evaluation is complex and time-consuming. Teachers need assessments that simultaneously assess student learning, provide differentiation pathways, and showcase instructional quality for LEADS evaluation purposes.",
        solution: `1. Identify your assessment goals: What standards are you assessing? What LEADS elements do you want to demonstrate?
2. Gather student context: Reading levels, learning needs, prior assessment data
3. Open your AI platform (MagicSchool AI, Gemini, SchoolAI, ChatGPT, etc.)
4. Use the comprehensive LEADS assessment builder prompt (complete prompt below)
5. Generate tiered assessment with differentiated versions
6. Review for alignment with Louisiana standards and LEADS framework
7. Create scoring rubrics aligned to LEADS expectations
8. Prepare accommodation options for diverse learners
9. Document assessment choices for evaluation portfolios

This framework saves 25-35 minutes per assessment while ensuring LEADS alignment and differentiation.`,
        samplePrompt: `Act as an expert Louisiana assessment specialist with deep knowledge of the Louisiana LEADS framework and differentiated assessment design. I need to create a comprehensive assessment that demonstrates my effectiveness as an educator while accurately measuring student learning.

**ASSESSMENT CONTEXT:**
- **Subject:** [Subject area]
- **Grade Level:** [Grade]
- **Assessment Type:** [Formative/Summative/Performance Task]
- **Duration:** [Time students will have]
- **Standards Being Assessed:** [Paste Louisiana state standards being assessed]

**LEADS FRAMEWORK ALIGNMENT:**
I need this assessment to demonstrate effectiveness in these LEADS components:
- **Component 1.2:** Knowledge of students (differentiated assessment design)
- **Component 3.1:** Classroom environment (supportive assessment culture)
- **Component 3.2:** Questioning and discussion (assessment includes higher-order questions)
- **Component 3.3:** Engagement (assessment engages diverse learners)
- **Component 3.4:** Assessment of learning (multiple assessment strategies)

**STUDENT DIVERSITY:**
- **Approaching Grade Level:** [Number/description]
- **Meeting Grade Level:** [Number/description]
- **Exceeding Grade Level:** [Number/description]
- **Students with IEPs:** [Accommodations needed]
- **English Learners:** [Proficiency levels and supports needed]

**ASSESSMENT DESIGN REQUIREMENTS:**

**PART 1: TIERED ASSESSMENT STRUCTURE**
Create three parallel versions of this assessment:
1. **Approaching Grade Level Version:**
   - Scaffolded questions and prompts
   - Simplified vocabulary where appropriate
   - Reduced item count but maintains standard alignment
   - Clear, step-by-step instructions
   - Visual supports and examples

2. **Meeting Grade Level Version:**
   - Standard grade-level expectations
   - Appropriate complexity for grade level
   - Full standard coverage

3. **Exceeding Grade Level Version:**
   - Extended complexity and depth
   - Higher-order thinking demands
   - Real-world application and analysis
   - Extension opportunities

**PART 2: LOUISIANA LEADS ALIGNMENT EVIDENCE**
For each LEADS component listed above, explain:
- How this assessment demonstrates effectiveness
- Specific features that show differentiation
- Evidence of knowledge of students
- Engagement strategies embedded
- Assessment variety and appropriateness

**PART 3: DIFFERENTIATED ITEM DESIGN**
Create assessment items that:
1. Assess the same standards across all tiers
2. Vary in complexity, not content coverage
3. Include multiple question types (multiple choice, short answer, extended response, performance task)
4. Provide appropriate scaffolds for approaching learners
5. Challenge exceeding learners appropriately
6. Align with Louisiana assessment expectations

**PART 4: ACCOMMODATION & MODIFICATION GUIDE**
Provide:
1. Specific accommodations for students with IEPs
2. English learner supports (native language support, vocabulary scaffolds, etc.)
3. Technology integration options
4. Extended time considerations
5. Alternative response formats

**PART 5: SCORING RUBRIC DESIGN**
Create rubrics that:
1. Align with Louisiana grade-level expectations
2. Show clear progression from approaching → meeting → exceeding
3. Provide actionable feedback language
4. Connect to LEADS evaluation criteria
5. Support student self-assessment

**PART 6: EVIDENCE COLLECTION FOR LEADS**
Document:
1. How assessment data informs instruction (LEADS Component 3.4)
2. Differentiation strategies showcased
3. Student engagement evidence
4. Question quality demonstration (Component 3.2)
5. Connection to ongoing assessment practices

**LOUISIANA LEADS FRAMEWORK NOTES:**
- Ensure assessment demonstrates "effectiveness" level expectations
- Show evidence of "knowledge of students" through differentiation
- Reflect "assessment of learning" with varied strategies
- Connect to "professional growth" through reflection opportunities

**OUTPUT REQUIREMENTS:**
1. Complete tiered assessment ready to use
2. LEADS alignment documentation
3. Scoring rubrics for all tiers
4. Accommodation implementation guide
5. Reflection questions for LEADS portfolio

**CRITICAL CONSTRAINTS:**
- Must maintain academic rigor while providing access
- Must align with Louisiana testing format expectations
- Must be appropriate for [grade level] developmental readiness
- Must save significant planning time while ensuring quality
- Must demonstrate Louisiana educator expertise

Please create this comprehensive LEADS-aligned assessment now.`,
        ethicalGuardrail: "This framework helps create differentiated assessments efficiently, but you must ensure assessments are fair, accessible, and accurately measure what you intend. Always review AI-generated assessments for bias, cultural sensitivity, and alignment with your students' actual needs. Use your professional judgment to modify AI suggestions. LEADS evaluation should showcase your authentic teaching, not just follow templates.",
        tipsAndVariations: "Use this for major assessments that will be part of your LEADS portfolio. Save templates for different assessment types. Share with colleagues for collaborative assessment design. Use tiered versions to track student growth over time. Document assessment modifications for LEADS evidence collection. Connect assessment data to instructional planning for maximum LEADS alignment.",
        timeEstimate: 30,
        difficultyLevel: "advanced" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: ["All Louisiana State Standards"],
        lerDomains: ["Domain 1: Planning and Preparation", "Domain 3: Instruction", "Domain 4: Professional Responsibilities"],
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
