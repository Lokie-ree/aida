import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";
import { rag } from "./rag";

/**
 * Workflow Steps for Alignment Scorecard Analysis
 * 
 * These steps are orchestrated by the alignmentScorecard workflow
 */

// Step 1: Retrieve standards from RAG
export const retrieveStandards = internalAction({
  args: {
    gradeLevel: v.string(),
    subject: v.string(),
    standardCodes: v.optional(v.array(v.string())),
  },
  returns: v.array(
    v.object({
      code: v.string(),
      text: v.string(),
      cognitiveDepth: v.optional(
        v.union(
          v.literal("recall"),
          v.literal("application"),
          v.literal("synthesis")
        )
      ),
    })
  ),
  handler: async (ctx, args) => {
    // Build filters for RAG search
    const filters: Array<{ name: string; value: string }> = [
      { name: "gradeLevel", value: args.gradeLevel },
      { name: "subject", value: args.subject },
      { name: "contentType", value: "louisiana_standard" },
    ];

    // Use RAG to search for relevant standards
    const { results } = await rag.search(ctx, {
      namespace: "louisiana_standards",
      query: `Grade ${args.gradeLevel} ${args.subject} standards`,
      filters: filters,
      limit: 10,
      vectorScoreThreshold: 0.6,
    });

    // If specific standard codes provided, filter to those
    let filteredResults = results;
    if (args.standardCodes && args.standardCodes.length > 0) {
      filteredResults = results.filter((r) => {
        const firstContent = r.content[0];
        const code = firstContent?.metadata?.standardCode as string | undefined;
        return code && args.standardCodes!.includes(code);
      });
    }

    return filteredResults.map((r) => {
      const firstContent = r.content[0];
      return {
        code: (firstContent?.metadata?.standardCode as string) || "unknown",
        text: firstContent?.text || "",
        cognitiveDepth: (firstContent?.metadata?.cognitiveDepth as
          | "recall"
          | "application"
          | "synthesis"
          | undefined) || "recall",
      };
    });
  },
});

// Step 2: Analyze with Agent
export const analyzeWithAgent = internalAction({
  args: {
    content: v.string(),
    standards: v.array(
      v.object({
        code: v.string(),
        text: v.string(),
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
    alignmentAnalysis: v.string(),
    standardMatches: v.array(v.any()),
    cognitiveDepthGaps: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    // Use Agent for structured LLM analysis
    const agent = new Agent(components.agent, {
      name: "AlignmentAnalyzer",
      languageModel: openai("gpt-4o"),
      instructions: `You are Pelican AI's Alignment Analyzer, an expert at evaluating educational content against Louisiana Student Standards.

Your role is to:
1. Analyze AI-generated educational content (quizzes, lesson plans, activities) against Louisiana Standards
2. Identify alignment strengths and gaps
3. Evaluate cognitive depth (recall vs application vs synthesis)
4. Provide specific, actionable feedback

You understand that Louisiana educators need confidence that their AI-generated content actually meets state standards and evaluation criteria.`,
    });

    // Create thread and run analysis
    // Note: createThread in ActionCtx returns { threadId, thread }, but we only need threadId
    const threadResult = await agent.createThread(ctx, {});
    const threadId = threadResult.threadId;

    const standardsText = args.standards
      .map(
        (s) =>
          `Standard ${s.code} (${s.cognitiveDepth || "recall"}): ${s.text}`
      )
      .join("\n\n");

    const prompt = `Analyze this AI-generated educational content against the following Louisiana Standards:

CONTENT TO ANALYZE:
${args.content}

LOUISIANA STANDARDS:
${standardsText}

Please provide:
1. Overall alignment assessment
2. Which standards are addressed and which are missing
3. Cognitive depth analysis (does the content match the required depth - recall, application, or synthesis?)
4. Specific gaps where the content doesn't meet standard requirements
5. Recommendations for improvement

Be specific and cite standard codes in your analysis.`;

    // Use generateText to get analysis
    const response = await agent.generateText(ctx, {
      threadId,
    }, {
      model: openai("gpt-4o"),
      prompt: prompt,
    });

    // Parse the response to extract structured data
    // For now, return the raw response - in production, you'd parse this more carefully
    const responseText = response.text || "Analysis unavailable";
    return {
      alignmentAnalysis: responseText,
      standardMatches: args.standards.map((s) => ({
        code: s.code,
        matched: true, // Would be determined by LLM analysis
      })),
      cognitiveDepthGaps: [], // Would be extracted from LLM analysis
    };
  },
});

// Step 3: Generate scorecard
export const generateScorecard = internalAction({
  args: {
    analysis: v.object({
      alignmentAnalysis: v.string(),
      standardMatches: v.array(v.any()),
      cognitiveDepthGaps: v.array(v.string()),
    }),
    standards: v.array(
      v.object({
        code: v.string(),
        text: v.string(),
        cognitiveDepth: v.optional(
          v.union(
            v.literal("recall"),
            v.literal("application"),
            v.literal("synthesis")
          )
        ),
      })
    ),
    content: v.string(),
  },
  returns: v.object({
    overallScore: v.number(),
    breakdown: v.array(v.any()),
    gaps: v.array(v.string()),
    recommendations: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    // Use Agent to structure the analysis into a scorecard
    const agent = new Agent(components.agent, {
      name: "ScorecardGenerator",
      languageModel: openai("gpt-4o"),
      instructions: `You are Pelican AI's Scorecard Generator. You transform alignment analyses into structured, actionable scorecards for Louisiana educators.

Generate scorecards that:
- Provide clear percentage scores (0-100%)
- Break down alignment by standard
- List specific gaps with standard codes
- Offer actionable recommendations
- Use Louisiana-specific language and context`,
    });

    const threadResult = await agent.createThread(ctx, {});
    const threadId = threadResult.threadId;

    const prompt = `Generate a structured alignment scorecard from this analysis:

ANALYSIS:
${args.analysis.alignmentAnalysis}

STANDARDS ANALYZED:
${args.standards.map((s) => `${s.code}: ${s.text}`).join("\n")}

Return a JSON object with:
{
  "overallScore": <number 0-100>,
  "breakdown": [
    {
      "standardCode": "<code>",
      "score": <number 0-100>,
      "status": "aligned" | "partial" | "missing",
      "notes": "<explanation>"
    }
  ],
  "gaps": ["<specific gap 1>", "<specific gap 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...]
}

Be specific and cite standard codes.`;

    // Use generateText to get scorecard
    const response = await agent.generateText(ctx, {
      threadId,
    }, {
      model: openai("gpt-4o"),
      prompt: prompt,
    });

    // Parse JSON response
    try {
      const scorecardText = response.text || "{}";
      // Extract JSON from markdown code blocks if present
      const jsonMatch = scorecardText.match(/```json\n([\s\S]*?)\n```/) || scorecardText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : scorecardText;
      const parsed = JSON.parse(jsonText);

      return {
        overallScore: parsed.overallScore || 0,
        breakdown: parsed.breakdown || [],
        gaps: parsed.gaps || [],
        recommendations: parsed.recommendations || [],
      };
    } catch (error) {
      // Fallback if JSON parsing fails
      console.error("Failed to parse scorecard JSON:", error);
      return {
        overallScore: 0,
        breakdown: [],
        gaps: ["Failed to generate scorecard"],
        recommendations: ["Please review the analysis manually"],
      };
    }
  },
});

// Step 4: Save to database
export const saveAnalysis = internalMutation({
  args: {
    userId: v.string(),
    content: v.string(),
    scorecard: v.object({
      overallScore: v.number(),
      breakdown: v.array(v.any()),
      gaps: v.array(v.string()),
      recommendations: v.array(v.string()),
    }),
    gradeLevel: v.string(),
    subject: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("alignmentAnalyses", {
      userId: args.userId,
      content: args.content,
      gradeLevel: args.gradeLevel,
      subject: args.subject,
      alignmentScore: args.scorecard.overallScore,
      scorecard: args.scorecard,
      analyzedAt: Date.now(),
    });
  },
});

