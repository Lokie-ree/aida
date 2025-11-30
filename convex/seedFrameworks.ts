/**
 * ✅ ACTIVE - Used in production
 * Seed function: seedInitialFrameworks (10 frameworks for beta launch)
 */
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { LER_INDICATORS } from "./lerDefinitions";

/**
 * Helper to format LER context for prompts
 */
function formatLERContext(indicators: (keyof typeof LER_INDICATORS)[]) {
  return `
LDOE EVALUATION CONTEXT (LOUISIANA EDUCATOR RUBRIC):
Use these specific Louisiana definitions to guide your response. Do not use generic pedagogical definitions.

${indicators.map(key => {
    const i = LER_INDICATORS[key];
    return `${i.name} (${i.code}) - ${i.domain} Domain:
EXEMPLARY (LEVEL 5) PERFORMANCE:
${i.exemplary}

PROFICIENT (LEVEL 3) PERFORMANCE:
${i.proficient}`;
  }).join("\n\n")}
`;
}

/**
 * Seed Initial Frameworks - Grassroots Launch
 * 
 * Starting with 10 frameworks for 5 educators:
 * - 3 Advanced Louisiana-Specific Frameworks (AIB-001, AIB-006, AIB-008)
 * - 7 Essential Frameworks for diverse educator roles
 * 
 * We're Louisiana educators building this together. These frameworks are platform-agnostic
 * guidance that works with ANY AI tool you already use.
 */
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
        title: "Louisiana Lesson Alignment Analyzer",
        module: "ai-basics-hub" as const,
        category: "louisiana-framework",
        tags: ["louisiana-standards", "ler-alignment", "lesson-planning", "rigor"],
        challenge: "Every Louisiana teacher knows the sinking feeling: 'Is this lesson actually aligned to the standard? Will this generate the evidence an observer expects on the Louisiana Educator Rubric?' You're anxious—Am I accidentally watering down grade-level expectations? Does this align with what LEAP will assess? This is Alignment Anxiety, compounded by planning in isolation without a trusted second set of eyes.",
        solution: `1. Gather your lesson context (grade, subject, full Louisiana standard code/text, lesson activities)
2. Open your preferred AI platform (MagicSchool AI, Gemini, SchoolAI, ChatGPT, Claude, etc.)
3. Copy the Louisiana Alignment Prompt below
4. Replace bracketed placeholders with your specific information
5. Review the 5-part analysis: Standard Breakdown, Rigor Check, LER Alignment, LEAP Readiness, Refinement
6. Use your professional judgment to adapt recommendations to your specific students and context

This takes approximately 5 minutes and provides a "master teacher gut check" before you teach.`,
        samplePrompt: `You are an expert Louisiana instructional coach helping me ensure my lesson is aligned to state standards, the Louisiana Educator Rubric, and LEAP expectations.

LESSON CONTEXT:
Grade Level: [INSERT GRADE]
Subject: [INSERT SUBJECT]
Louisiana Student Standard: [INSERT FULL STANDARD CODE AND TEXT, e.g., "4.NF.A.2: Compare two fractions with different numerators and different denominators by creating common denominators or numerators, or by comparing to a benchmark fraction such as 1/2"]
Lesson Activities: [INSERT 2-3 SENTENCES DESCRIBING WHAT STUDENTS WILL DO, e.g., "Students will work in pairs to sort 20 fraction cards into groups (less than 1/2, equal to 1/2, greater than 1/2). They will justify their placement using visual models. The lesson concludes with students writing one comparison statement with evidence."]

Please provide FIVE outputs:

1. STANDARD BREAKDOWN: What are the 3-4 component skills embedded in this Louisiana standard? What is the cognitive demand (DOK level) required for mastery?

2. RIGOR CHECK: Based on the lesson activities I described, does this lesson meet the full depth and rigor of the standard, or is there a gap? Be specific about what is present and what is missing.

3. LER INDICATOR ALIGNMENT: Which Louisiana Educator Rubric indicators does this lesson have the strongest potential to demonstrate? For each indicator, explain what specific evidence an observer would see.

4. LEAP READINESS: Based on LEAP Achievement Level Descriptors for this grade and subject, what does "Mastery" level performance look like for this standard? Does my lesson build toward that level of performance?

5. REFINEMENT FOR PROFICIENT (LER LEVEL 3→4): Provide ONE concrete, high-leverage refinement to move this lesson from "Effective" to "Proficient" on the LER. Make it specific enough that I can implement it in my next lesson.

Format this as a clear planning guide I can reference when revising my lesson.${formatLERContext(["SO", "IP", "SW", "AS"])}`,
        ethicalGuardrail: "AI can help unpack standards, but your professional judgment determines how to teach them. Always verify alignment with Louisiana's official curriculum documents and your district's scope and sequence. You remain the instructional decision-maker. This is a planning assistant built by Louisiana educators, for Louisiana educators.",
        tipsAndVariations: "Use this for any lesson where you're uncertain about alignment. Create anchor charts from the analysis. Share key insights with PLC colleagues. This directly addresses the #1 pain point for Louisiana teachers: 'Is this quiz any good? Does it ACTUALLY test the Louisiana standard?' This is your quality-keeper and confidence-builder.",
        timeEstimate: 20,
        difficultyLevel: "advanced" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: ["All Louisiana State Standards"],
        lerDomains: ["Domain 1: INSTRUCTION", "Domain 2: PLANNING"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
        averageRating: undefined,
        averageTimeSaved: undefined,
      },
      {
        frameworkId: "AIB-006",
        title: "10-Minute Curriculum Internalizer",
        module: "ai-basics-hub" as const,
        category: "louisiana-framework",
        tags: ["curriculum", "lesson-planning", "fidelity", "differentiation"],
        challenge: "Your district adopted a high-quality curriculum—excellent news. The challenge? It's a sprawling, multi-hundred-page document. You're told to implement with fidelity AND differentiate. You're not sure which parts are non-negotiable and which are flexible. This is Curriculum Overwhelm: skip it entirely and lose research-based design, follow rigidly without understanding the why, or spend hours reading without clarity.",
        solution: `1. Gather your curriculum materials (name, publisher, grade, unit, lesson numbers, relevant pages)
2. Open your AI platform (MagicSchool AI, Gemini, SchoolAI, ChatGPT, Claude, etc.)
3. Copy the Curriculum Internalization Prompt below
4. Paste your curriculum text or upload images
5. Review 6 outputs: Big Idea, Instructional Structure, Non-Negotiables, Flex Points, Misconceptions, Prep Checklist
6. Use your professional knowledge to adapt to your students

This takes 10 minutes and prepares you to teach with both fidelity and flexibility.`,
        samplePrompt: `You are an expert instructional coach helping me internalize my curriculum guide so I can teach this lesson with both fidelity and flexibility.

CURRICULUM CONTEXT:
Curriculum Name: [INSERT CURRICULUM NAME, e.g., "Eureka Math Grade 3 Module 4 Lesson 12"]
Grade and Subject: [INSERT GRADE AND SUBJECT]
Lesson/Unit: [INSERT SPECIFIC LESSON OR UNIT REFERENCE]

I am providing the relevant pages from my curriculum guide below. [PASTE CURRICULUM TEXT OR UPLOAD IMAGES]

Please provide SIX outputs:

1. THE BIG IDEA: In 2-3 sentences, what is the core mathematical or conceptual understanding this lesson is building? Why does this lesson matter in the bigger picture of the unit or year?

2. INSTRUCTIONAL STRUCTURE: What is the intended flow of this lesson? Identify the key phases (e.g., warm-up, guided instruction, independent practice, closure) and the purpose of each phase.

3. NON-NEGOTIABLE ELEMENTS: What are the 2-3 elements of this lesson that I must implement with fidelity to preserve the curriculum's design? These are the "load-bearing walls" I should not remove or modify.

4. FLEX POINTS: Where does this curriculum expect me to differentiate or adapt based on my students? What decisions am I supposed to make in the moment?

5. ANTICIPATED MISCONCEPTIONS: What student misunderstandings does this curriculum predict or address? How does it suggest I respond to those misconceptions?

6. LESSON PREP CHECKLIST: What materials, models, or teacher moves do I need to prepare in advance to teach this lesson effectively? Give me a concrete list I can check off.

Format this as a focused internalization guide I can reference while teaching.${formatLERContext(["IP", "PIC", "SO"])}`,
        ethicalGuardrail: "This framework accelerates curriculum internalization, but your professional judgment, knowledge of your students, and alignment with your district's curriculum are essential. This is a planning assistant built by educators who understand the real work of teaching.",
        tipsAndVariations: "Use this at the start of each unit. Keep generated frameworks as templates for future years. Share with PLC teams for collaborative planning. This solves Curriculum Overwhelm: you now know what to preserve (fidelity) and where to adapt (flexibility).",
        timeEstimate: 15,
        difficultyLevel: "advanced" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 2: PLANNING", "Domain 1: INSTRUCTION"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "AIB-008",
        title: "Louisiana Contextualization Engine",
        module: "ai-basics-hub" as const,
        category: "louisiana-framework",
        tags: ["contextualization", "cultural-relevance", "louisiana", "engagement"],
        challenge: "You're teaching a lesson on economic systems—the curriculum example is a factory in Ohio. Your students have never been to Ohio. You're teaching about historical courage—the curriculum highlights Alabama. Your students struggle to connect. This is the Distant Curriculum Problem: reduced engagement, increased cognitive load, and a subtle message that learning is about other places, not Louisiana, not your community, not them.",
        solution: `1. Gather lesson details (grade, subject, learning objective, original curriculum context)
2. Gather student context (community description, region of Louisiana, student interests)
3. Open your AI platform (MagicSchool AI, Gemini, SchoolAI, ChatGPT, Claude, etc.)
4. Copy the Louisiana Contextualization Prompt below
5. Replace placeholders with your specific information
6. Review 4 outputs: Louisiana Context, Local Hooks, Authenticity Check, Extension Opportunities
7. Use your community knowledge to verify authenticity and adjust as needed

This takes 5 minutes and transforms a distant lesson into a locally relevant one.`,
        samplePrompt: `You are an expert Louisiana instructional designer helping me contextualize my curriculum to make it more relevant and engaging for my specific students.

LESSON CONTEXT:
Grade Level: [INSERT GRADE]
Subject: [INSERT SUBJECT]
Learning Objective/Standard: [INSERT THE STANDARD OR OBJECTIVE, e.g., "Students will analyze data sets and calculate measures of central tendency"]
Original Curriculum Context: [DESCRIBE THE CURRENT EXAMPLE, e.g., "The lesson uses data about favorite ice cream flavors from a national survey of 1,000 students"]

STUDENT CONTEXT:
Community: [DESCRIBE YOUR STUDENTS' COMMUNITY, e.g., "Rural, sugarcane farming community outside of New Iberia, Louisiana. Many students' families work in agriculture."]
Student Interests: [DESCRIBE RECENT INTERESTS OR ENTHUSIASMS, e.g., "Students loved the recent crawfish festival and have been asking about how crawfish farming works"]

Please provide FOUR outputs:

1. LOUISIANA CONTEXTUALIZATION: Replace the original curriculum context with a Louisiana-specific example that is authentic to my students' lives and community. The new context must preserve the exact same learning objective and cognitive demand as the original.

2. LOCAL HOOKS: Provide 2-3 opening lines or questions I can use to introduce the lesson that immediately connect to my students' prior knowledge or community experiences.

3. CULTURAL AUTHENTICITY CHECK: Does this contextualization accurately reflect Louisiana culture, economy, or geography? If I am using a cultural reference (Cajun, Creole, Mardi Gras traditions, etc.), provide guidance on how to present it respectfully and accurately.

4. EXTENSION OPPORTUNITY: Suggest one way this Louisiana context could extend beyond the lesson. For example, could this connect to a local expert we could invite, a field trip opportunity, or a community-based project?

Format this as a clear revision guide I can use to adapt my lesson.`,
        ethicalGuardrail: "Contextualization must be authentic and respectful. Louisiana has rich, diverse cultures. Avoid stereotypes. Use your community knowledge to verify authenticity. You know your students' families, traditions, and lived experiences—trust that knowledge. This is built by Louisiana educators who understand that learning should reflect students' worlds.",
        tipsAndVariations: "Use this when curriculum examples feel distant or generic. Invite students to suggest local connections. This sends a powerful message: your community matters, your experiences are valuable, and learning is about understanding the world you actually live in.",
        timeEstimate: 10,
        difficultyLevel: "advanced" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 1: INSTRUCTION", "Domain 3: ENVIRONMENT"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "AIB-002",
        title: "Document Summarization for Professional Reading",
        module: "ai-basics-hub" as const,
        category: "teacher-productivity",
        tags: ["summarization", "professional-development", "reading"],
        challenge: "Keeping up with educational research, curriculum guides, and policy documents is essential but time-consuming. You need to extract key information quickly to implement in your classroom.",
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
        tipsAndVariations: "Use this for curriculum guides, research papers, and district memos. Create a personal knowledge base by saving summaries. Essential for tech facilitators who need to stay current and support other teachers.",
        timeEstimate: 8,
        difficultyLevel: "beginner" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 4: PROFESSIONALISM"],
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
        lerDomains: ["Domain 4: PROFESSIONALISM"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
      {
        frameworkId: "AIB-003",
        title: "Email Drafting for Parent Communication",
        module: "ai-basics-hub" as const,
        category: "teacher-productivity",
        tags: ["email", "parent-communication", "productivity"],
        challenge: "Drafting a sensitive email to a parent about a student's struggles can be time-consuming and emotionally taxing. Professional parent communication is essential for all educators.",
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
        tipsAndVariations: "For urgent situations, start with a phone call. For positive news, consider adding a specific example of recent success. This saves time on professional communication while maintaining quality.",
        timeEstimate: 10,
        difficultyLevel: "beginner" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: [],
        lerDomains: ["Domain 4: PROFESSIONALISM"],
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
        challenge: "Breaking down complex Louisiana state standards into clear, measurable learning objectives takes significant time and expertise. LER Domain 1: INSTRUCTION - Standards and Objectives (SO) requires all learning objectives and state content standards to be explicitly communicated and understood by students, with objectives aligned to the depth and rigor of state standards.",
        solution: `1. Identify the specific Louisiana standard you're addressing
2. Open your AI platform
3. Use the standards unpacking prompt
4. Review the generated objectives and success criteria
5. Align with your curriculum and student needs
6. Refine based on your professional judgment
7. Ensure alignment with LER Domain 1: INSTRUCTION - Standards and Objectives (SO)`,
        samplePrompt: `Act as a Louisiana curriculum specialist with expertise in the Louisiana Educator Rubric (LER). Analyze this Louisiana state standard and help me unpack it for lesson planning, ensuring alignment with LER Domain 1: INSTRUCTION - Standards and Objectives (SO).

**Standard:** [Paste full standard here]
**Grade Level:** [Grade]
**Subject:** [Subject]

Please provide:
1. A clear explanation of what this standard means in student-friendly language
2. Three differentiated "I can" statements (approaching, meeting, exceeding) that students can articulate
3. Key vocabulary students need to understand
4. Potential misconceptions students might have
5. Suggested formative assessment strategies

**LER Domain 1: INSTRUCTION - Standards and Objectives (SO) Alignment:**
- Ensure objectives are explicitly communicated and understood by students
- Align objectives to the depth and rigor of the state standards
- Connect objectives to prior learning and life experiences (for Exemplary rating)
- Create clear, demanding, and high expectations for each student's performance
- Ensure student work is aligned to state content standards and learning objectives${formatLERContext(["SO"])}`,
        ethicalGuardrail: "AI can help unpack standards, but your professional judgment determines how to teach them. Always verify alignment with Louisiana's official curriculum documents and your district's scope and sequence. LER alignment supports evaluation but should reflect authentic teaching practice.",
        tipsAndVariations: "Use this for unit planning. Create anchor charts from the 'I can' statements. Share unpacked standards with students at the start of units. Display objectives and reference throughout the lesson per LER expectations. This directly addresses Pain Point #3: Standards Unpacking and Alignment.",
        timeEstimate: 20,
        difficultyLevel: "intermediate" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: ["All Louisiana State Standards"],
        lerDomains: ["Domain 1: INSTRUCTION", "Domain 2: PLANNING"],
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
        challenge: "Translating complex standards into student-friendly 'I can' statements that guide learning and assessment. LER Domain 1: INSTRUCTION - Standards and Objectives (SO) requires learning objectives to be displayed and referenced throughout the lesson, with students able to articulate what they are learning and why.",
        solution: `1. Start with your unpacked Louisiana standard
2. Use the 'I can' statement prompt
3. Generate multiple levels of complexity
4. Review for clarity and age-appropriateness
5. Create visual displays for your classroom
6. Plan how students will articulate these statements during lessons`,
        samplePrompt: `Create student-friendly "I can" statements for this Louisiana standard, aligned with LER Domain 1: INSTRUCTION - Standards and Objectives (SO):

**Standard:** [Paste standard here]
**Grade Level:** [Grade]
**Subject:** [Subject]

**Requirements:**
- Use "I can" language
- Make it age-appropriate for [grade level]
- Include three levels: approaching, meeting, exceeding
- Focus on what students will DO, not what they will know
- Keep it specific and measurable
- Ensure students can articulate what they are learning and why (LER alignment)

**Format:**
- Approaching: I can [basic skill/understanding]
- Meeting: I can [grade-level expectation]
- Exceeding: I can [advanced application/analysis]

**LER Alignment:**
- Create statements students can explain to their peers
- Connect to what students have previously learned
- Include clear expectations for student performance${formatLERContext(["SO"])}`,
        ethicalGuardrail: "These statements guide student learning and assessment. Ensure they accurately reflect the standard and are appropriate for your students' developmental level. LER alignment supports evaluation readiness.",
        tipsAndVariations: "Use these for lesson objectives, exit tickets, and student self-assessment. Display them prominently in your classroom. Have students reference them throughout lessons per LER expectations. This supports Pain Point #3: Standards Unpacking and Alignment.",
        timeEstimate: 15,
        difficultyLevel: "intermediate" as const,
        platformCompatibility: ["MagicSchool AI", "Gemini", "SchoolAI", "ChatGPT", "Claude"],
        louisianaStandards: ["All Louisiana State Standards"],
        lerDomains: ["Domain 1: INSTRUCTION", "Domain 2: PLANNING"],
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
        lerDomains: ["Domain 2: PLANNING", "Domain 1: INSTRUCTION"],
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
        lerDomains: ["Domain 2: PLANNING", "Domain 3: ENVIRONMENT"],
        status: "published" as const,
        createdBy: adminUserId,
        publishedAt: Date.now(),
        usageCount: 0,
      },
    ];

    // Insert or update all frameworks (10 total: 6 AIB + 4 IEH)
    for (const framework of [...aibFrameworks, ...iehFrameworks]) {
      const existing = await ctx.db
        .query("frameworks")
        .withIndex("by_framework_id", (q) => q.eq("frameworkId", framework.frameworkId))
        .first();

      if (existing) {
        // Update existing framework with new prompt and definition
        await ctx.db.patch(existing._id, {
          samplePrompt: framework.samplePrompt,
          title: framework.title,
          challenge: framework.challenge,
          solution: framework.solution,
          tags: framework.tags,
          lerDomains: framework.lerDomains,
        });
      } else {
        await ctx.db.insert("frameworks", framework);
      }
    }

    return null;
  },
});

// Admin user creation is handled by Better Auth
