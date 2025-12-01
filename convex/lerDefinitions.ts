/**
 * Louisiana Educator Rubric (LER) Definitions
 * 
 * Extracted from knowledge/la-ler-rubric.md
 * Used to infuse AI prompts with specific rubric language.
 */

export const LER_INDICATORS = {
  SO: {
    code: "SO",
    name: "Standards and Objectives",
    domain: "INSTRUCTION",
    proficient: `• Learning objectives and state content standards are communicated.
• Objectives and expectations are aligned to the depth and rigor of the state standards; lesson content is aligned to the objectives of the high-quality instructional materials.
• Sub-objective/Prerequisite skills are aligned to the lesson's major objective.
• Learning objectives are connected to what students have previously learned.
• Expectations for student performance are clear.
• Learning objectives are displayed.
• There is evidence that students are progressing or demonstrating mastery of the objective(s).`,
    exemplary: `• All learning objectives and state content standards, and their connection to student work expectations, are explicitly communicated and understood by students.
• Objectives and expectations are aligned to the depth and rigor of the state standards; lesson content is aligned to the objectives of the high-quality instructional materials.
• Sub-objectives/Prerequisite skills are aligned and logically sequenced to the lesson's major objective.
• Students make connections between learning objectives and (a) what they have previously learned, (b) know from life experiences, and/or (c) knowledge of other disciplines.
• Expectations for each student's performance are clear, demanding, and high, and student work is aligned to state content standards and learning objectives.
• Students are able to articulate what they are learning and why and explain those to their peers.
• Learning objectives are displayed and referenced throughout the lesson with explanations.
• Student work shows evidence that each student is progressing or demonstrating mastery of the objective(s).`
  },
  PIC: {
    code: "PIC",
    name: "Presenting Instructional Content",
    domain: "INSTRUCTION",
    proficient: `Presentation of content consistently includes:
• visuals that establish the purpose of the lesson, preview the organization of the lesson, and include internal summaries of the lesson;
• examples, illustrations, analogies, and labels for new concepts and ideas;
• modeling by the teacher to demonstrate his or her performance expectations;
• criteria that clarifies how students can be successful;
• concise communication;
• logical sequencing and segmenting;
• all essential information; and
• no irrelevant, confusing, or nonessential information.`,
    exemplary: `Presentation of content always includes:
• visuals, including student work exemplars, that establish the purpose of the lesson, preview the organization of the lesson, and include internal summaries of the lesson;
• examples, illustrations, analogies, and labels for new concepts and ideas;
• modeling by the teacher or student that demonstrates accurate understanding of the content and meets performance expectations;
• criteria that clarifies how students can be successful;
• concise communication;
• logical sequencing and segmenting;
• all essential information; and
• no irrelevant, confusing, or nonessential information.`
  },
  IP: {
    code: "IP",
    name: "Instructional Plans",
    domain: "PLANNING",
    proficient: `Instructional plans include:
• some evidence of the internalization of the plans from the high-quality curriculum;
• objectives aligned to state standards and aligned high-quality curriculum, both in content and in rigor;
• activities, materials, and assessments that:
  - are aligned to state standards; content, including high-quality curriculum; and success criteria;
  - are sequenced and scaffolded based on student need;
  - build on prior student knowledge; and
  - provide appropriate time for student work and lesson closure;
• evidence that the plan is appropriate for the age, knowledge, and interests of learners; and
• evidence that the plan provides opportunities to accommodate individual student needs.`,
    exemplary: `Instructional plans include:
• evidence of the internalization of the plans from the high-quality curriculum;
• measurable and explicit objectives aligned to state standards and aligned high-quality curriculum, both in content and in rigor;
• activities, materials, and assessments that:
  - are aligned to state standards; content, including high-quality curriculum; and success criteria;
  - are sequenced and scaffolded based on student need;
  - build on prior student knowledge, are relevant to students' lives, and integrate other disciplines as appropriate; and
  - provide appropriate time for student work, student reflection, and lesson closure;
• evidence that the plan is appropriate for the age, knowledge, and interests of all learners;
• evidence that the plan provides regular opportunities to accommodate individual student needs; and
• strategies for student autonomy and ownership.`
  },
  SW: {
    code: "SW",
    name: "Student Work",
    domain: "PLANNING",
    proficient: `Assignments are:
• aligned to the rigor and depth of the standards and curriculum content.
• aligned to the lesson's objective and include descriptions of how assessment results will inform future instruction.
Assignments require students to:
• interpret information rather than reproduce it;
• draw conclusions and support them through writing; and
• connect what they are learning to prior learning and life experiences.`,
    exemplary: `Assignments are:
• always aligned to the rigor and depth of the standards and curriculum content.
• always aligned to the lesson's objective and include descriptions of how assessment results will inform future instruction.
Students:
• organize, interpret, analyze, synthesize, and evaluate information rather than reproduce it;
• draw conclusions, make generalizations, and produce arguments that are supported through extended writing; and
• connect what they are learning to experiences, observations, feelings, or situations significant in their daily lives, both inside and outside of school.`
  },
  AS: {
    code: "AS",
    name: "Assessment",
    domain: "PLANNING",
    proficient: `Assessments:
• are aligned with the depth and rigor of the state standards and content, including curriculum resources;
• are designed to provide feedback on progress against objectives;
• use a variety of question types and formats to gauge student learning and problem-solving;
• measure student performance in more than two ways (e.g., in the form of a project, experiment, presentation, essay, short answer, or multiple choice);
• require written responses as appropriate; and
• include performance checks and student reflection on performance throughout the school year.`,
    exemplary: `Assessments:
• are aligned with the depth and rigor of the state standards and content, including curriculum resources;
• are designed to provide feedback on progress against objectives;
• use a variety of question types and formats to gauge student learning and problem-solving;
• measure student performance in more than three ways (e.g., in the form of a project, experiment, presentation, essay, short answer, or multiple-choice);
• require extended written tasks as appropriate;
• include clear illustrations of student progress toward state standards, which students monitor, understand, and articulate; and
• include descriptions of how assessment results will be used by teachers and students to inform future instruction and learning.`
  }
};

