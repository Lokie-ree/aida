/**
 * ✅ ACTIVE - Used in production
 * Standards population: populateSampleStandards, populateStandardsFromData
 */
import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { rag } from "./rag";

/**
 * Populate RAG with Louisiana Student Standards
 * 
 * Takes scraped standards data and chunks it appropriately,
 * then adds to RAG with proper filters for semantic search.
 */

interface StandardData {
  standardCode: string;
  gradeLevel: string;
  subject: string;
  standardText: string;
  performanceExpectations?: string;
  cognitiveDepth?: "recall" | "application" | "synthesis";
}

/**
 * Add a single standard to RAG
 */
async function addStandardToRAG(
  ctx: any,
  standard: StandardData
): Promise<void> {
  // Create comprehensive text chunk with all standard information
  const textChunk = `Louisiana Student Standard: ${standard.standardCode}

Subject: ${standard.subject}
Grade Level: ${standard.gradeLevel}
Cognitive Depth: ${standard.cognitiveDepth || "recall"}

Standard Text:
${standard.standardText}

${standard.performanceExpectations ? `Performance Expectations:\n${standard.performanceExpectations}` : ""}`;

  await rag.add(ctx, {
    namespace: "louisiana_standards",
    key: `standard_${standard.standardCode}`,
    text: textChunk,
    filterValues: [
      { name: "contentType", value: "louisiana_standard" },
      { name: "subject", value: standard.subject },
      { name: "gradeLevel", value: standard.gradeLevel },
      { name: "standardCode", value: standard.standardCode },
      { name: "cognitiveDepth", value: standard.cognitiveDepth || "recall" },
    ],
  });
}

/**
 * Populate standards from scraper results
 */
export const populateStandardsFromScraper = action({
  args: {},
  returns: v.object({
    success: v.boolean(),
    addedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx): Promise<{
    success: boolean;
    addedCount: number;
    errors: string[];
  }> => {
    // Scrape all standards
    const scrapeResult: {
      success: boolean;
      totalStandards: number;
      bySubject: {
        ela: number;
        math: number;
        science: number;
        social_studies: number;
      };
      errors: string[];
    } = await ctx.runAction(
      internal.standardsScraper.scrapeAllStandards,
      {}
    );

    if (!scrapeResult.success) {
      return {
        success: false,
        addedCount: 0,
        errors: scrapeResult.errors,
      };
    }

    // Get individual subject results
    const [ela, math, science, socialStudies] = await Promise.all([
      ctx.runAction(internal.standardsScraper.scrapeELAStandards, {}),
      ctx.runAction(internal.standardsScraper.scrapeMathStandards, {}),
      ctx.runAction(internal.standardsScraper.scrapeScienceStandards, {}),
      ctx.runAction(internal.standardsScraper.scrapeSocialStudiesStandards, {}),
    ]);

    const allStandards: StandardData[] = [
      ...(ela.standards as StandardData[]),
      ...(math.standards as StandardData[]),
      ...(socialStudies.standards as StandardData[]),
      // Science standards would go here when ZIP parsing is implemented
    ];

    let addedCount = 0;
    const errors: string[] = [];

    // Add each standard to RAG
    for (const standard of allStandards) {
      try {
        await addStandardToRAG(ctx, standard);
        addedCount++;
      } catch (error) {
        errors.push(
          `Failed to add ${standard.standardCode}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return {
      success: errors.length === 0,
      addedCount,
      errors,
    };
  },
});

/**
 * Populate RAG with sample standards for beta testing
 * 
 * Extracts 30 standards from ELA (PK-5) and Science (K-8) for minimal viable RAG population.
 * Internal action - can be called from Convex dashboard without authentication.
 * TODO: Replace with full JSON-based population after beta launch (see RAG_PLAN.md Phase 1)
 */
export const populateSampleStandards = internalAction({
  args: {},
  returns: v.object({
    success: v.boolean(),
    addedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx) => {
    // Sample standards extracted from knowledge files
    // ELA standards (PK-5) - 15 standards
    // Science standards (K-8) - 15 standards
    const sampleStandards: StandardData[] = [
      // ELA Standards (PK-5) - 15 standards
      {
        standardCode: "RI.K.3",
        gradeLevel: "K",
        subject: "ela",
        standardText: "With prompting and support, describe the connection between two individuals, events, ideas, or pieces of information in a text.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "RL.K.1",
        gradeLevel: "K",
        subject: "ela",
        standardText: "With prompting and support, ask and answer questions about key details in a text.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "RI.1.3",
        gradeLevel: "1",
        subject: "ela",
        standardText: "Describe the connection between two individuals, events, ideas, or pieces of information in a text.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "RL.1.2",
        gradeLevel: "1",
        subject: "ela",
        standardText: "Retell stories, including key details, and demonstrate understanding of their central message or lesson.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "W.1.1",
        gradeLevel: "1",
        subject: "ela",
        standardText: "Write opinion pieces in which they introduce the topic or name the book they are writing about, state an opinion, supply a reason for the opinion, and provide some sense of closure.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "RI.2.3",
        gradeLevel: "2",
        subject: "ela",
        standardText: "Describe the connection between a series of historical events, scientific ideas or concepts, or steps in technical procedures in a text.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "RL.2.1",
        gradeLevel: "2",
        subject: "ela",
        standardText: "Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "W.2.2",
        gradeLevel: "2",
        subject: "ela",
        standardText: "Write informative/explanatory texts in which they introduce a topic, use facts and definitions to develop points, and provide a concluding statement or section.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "RI.3.3",
        gradeLevel: "3",
        subject: "ela",
        standardText: "Describe the relationship between a series of historical events, scientific ideas or concepts, or steps in technical procedures in a text, using language that pertains to time, sequence, and cause/effect.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "RL.3.1",
        gradeLevel: "3",
        subject: "ela",
        standardText: "Ask and answer questions to demonstrate understanding of a text, referring explicitly to the text as the basis for the answers.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "W.3.1",
        gradeLevel: "3",
        subject: "ela",
        standardText: "Write opinion pieces on topics or texts, supporting a point of view with reasons.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "RI.4.3",
        gradeLevel: "4",
        subject: "ela",
        standardText: "Explain events, procedures, ideas, or concepts in a historical, scientific, or technical text, including what happened and why, based on specific information in the text.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "RL.4.2",
        gradeLevel: "4",
        subject: "ela",
        standardText: "Determine a theme of a story, drama, or poem from details in the text; summarize the text.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "RI.5.3",
        gradeLevel: "5",
        subject: "ela",
        standardText: "Explain the relationships or interactions between two or more individuals, events, ideas, or concepts in a historical, scientific, or technical text based on specific information in the text.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "W.5.1",
        gradeLevel: "5",
        subject: "ela",
        standardText: "Write opinion pieces on topics or texts, supporting a point of view with reasons and information.",
        cognitiveDepth: "application",
      },
      
      // Science Standards (K-8) - 15 standards
      {
        standardCode: "K-PS2-1",
        gradeLevel: "K",
        subject: "science",
        standardText: "Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "K-PS3-1",
        gradeLevel: "K",
        subject: "science",
        standardText: "Make observations to determine the effect of sunlight on Earth's surface.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "K-LS-1-1",
        gradeLevel: "K",
        subject: "science",
        standardText: "Use observations to describe patterns of what plants and animals (including humans) need to survive.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "1-PS4-1",
        gradeLevel: "1",
        subject: "science",
        standardText: "Plan and conduct investigations to provide evidence that vibrating materials can make sound and that sound can make materials vibrate.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "1-LS1-1",
        gradeLevel: "1",
        subject: "science",
        standardText: "Use tools and materials to design a solution to a human problem by mimicking how plants and/or animals use their external parts to help them survive, grow, and meet their needs.",
        cognitiveDepth: "synthesis",
      },
      {
        standardCode: "2-PS1-1",
        gradeLevel: "2",
        subject: "science",
        standardText: "Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "2-LS2-1",
        gradeLevel: "2",
        subject: "science",
        standardText: "Plan and conduct an investigation to determine if plants need sunlight and water to grow.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "3-PS2-1",
        gradeLevel: "3",
        subject: "science",
        standardText: "Plan and conduct an investigation to provide evidence of the effects of balanced and unbalanced forces on the motion of an object.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "3-LS1-1",
        gradeLevel: "3",
        subject: "science",
        standardText: "Develop models to describe that organisms have unique and diverse life cycles but all have in common birth, growth, reproduction, and death.",
        cognitiveDepth: "synthesis",
      },
      {
        standardCode: "3-LS3-1",
        gradeLevel: "3",
        subject: "science",
        standardText: "Analyze and interpret data to provide evidence that plants and animals have traits inherited from their parents and that variation of these traits exists in a group of similar organisms.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "4-PS3-1",
        gradeLevel: "4",
        subject: "science",
        standardText: "Use evidence to construct an explanation relating the speed of an object to the energy of that object.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "4-PS3-2",
        gradeLevel: "4",
        subject: "science",
        standardText: "Make observations to provide evidence that energy can be transferred from place to place by sound, light, heat, and electric currents.",
        cognitiveDepth: "recall",
      },
      {
        standardCode: "5-PS1-1",
        gradeLevel: "5",
        subject: "science",
        standardText: "Develop a model to describe that matter is made of particles too small to be seen.",
        cognitiveDepth: "synthesis",
      },
      {
        standardCode: "5-LS1-1",
        gradeLevel: "5",
        subject: "science",
        standardText: "Support an argument that plants get the materials they need for growth chiefly from air and water.",
        cognitiveDepth: "application",
      },
      {
        standardCode: "5-ESS1-1",
        gradeLevel: "5",
        subject: "science",
        standardText: "Support an argument that differences in the apparent brightness of the sun compared to other stars is due to their relative distances from Earth.",
        cognitiveDepth: "application",
      },
    ];

    // Add each standard to RAG directly
    let addedCount = 0;
    const errors: string[] = [];

    for (const standard of sampleStandards) {
      try {
        await addStandardToRAG(ctx, standard);
        addedCount++;
      } catch (error) {
        errors.push(
          `Failed to add ${standard.standardCode}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return {
      success: errors.length === 0,
      addedCount,
      errors,
    };
  },
});

/**
 * Populate standards from provided data (for manual/testing use)
 */
export const populateStandardsFromData = action({
  args: {
    standards: v.array(
      v.object({
        standardCode: v.string(),
        gradeLevel: v.string(),
        subject: v.string(),
        standardText: v.string(),
        performanceExpectations: v.optional(v.string()),
        cognitiveDepth: v.optional(
          v.union(
            v.literal("recall"),
            v.literal("application"),
            v.literal("synthesis")
          )
        ),
      })
    ),
  },
  returns: v.object({
    success: v.boolean(),
    addedCount: v.number(),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    let addedCount = 0;
    const errors: string[] = [];

    for (const standard of args.standards) {
      try {
        await addStandardToRAG(ctx, standard);
        addedCount++;
      } catch (error) {
        errors.push(
          `Failed to add ${standard.standardCode}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    return {
      success: errors.length === 0,
      addedCount,
      errors,
    };
  },
});

