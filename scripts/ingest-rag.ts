#!/usr/bin/env tsx
/**
 * RAG Ingestion Script
 *
 * Reads Louisiana Student Standards, Educator Rubric, and Leader Handbook JSON files
 * and ingests them into the Convex RAG system.
 *
 * Usage:
 *   pnpm ingest-rag                       # Ingest all files (uses .env.local)
 *   pnpm ingest-rag --dry-run             # Preview without ingesting
 *   pnpm ingest-rag --subjects ela,math   # Ingest specific subjects only
 *   pnpm ingest-rag --rubric-only         # Ingest only the educator rubric
 *   pnpm ingest-rag --standards-only      # Ingest only standards
 *   pnpm ingest-rag --leader-handbook-only # Ingest only leader handbook coaching content
 *   pnpm ingest-rag --production          # Ingest to production (requires CONVEX_URL)
 *
 * Production Deployment:
 *   # Option 1: Set CONVEX_URL environment variable
 *   CONVEX_URL=https://outgoing-partridge-914.convex.cloud pnpm ingest-rag
 *
 *   # Option 2: Use --production flag (prompts for URL)
 *   pnpm ingest-rag --production
 *
 *   # Option 3: Temporarily modify .env.local
 *   # See PRODUCTION-DEPLOYMENT.md for details
 */

import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
config({ path: path.join(PROJECT_ROOT, ".env.local") });

const KNOWLEDGE_DIR = path.join(PROJECT_ROOT, "knowledge");

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isStandardsOnly = args.includes("--standards-only");
const isRubricOnly = args.includes("--rubric-only");
const isLeaderHandbookOnly = args.includes("--leader-handbook-only");
const isProduction = args.includes("--production");
const subjectsArg = args.find((arg) => arg.startsWith("--subjects="));
const selectedSubjects = subjectsArg
  ? subjectsArg.split("=")[1].split(",")
  : ["ela", "math", "science", "social_studies"];

// Detect production environment
function isProductionEnvironment(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("outgoing-partridge-914") || url.includes(".convex.cloud");
}

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

/**
 * File configuration
 */
const FILES = {
  ela: {
    path: "la-ela-standards.json",
    subject: "ela" as const,
    name: "ELA Standards",
  },
  math: {
    path: "la-math-standards.json",
    subject: "math" as const,
    name: "Math Standards",
  },
  science: {
    path: "la-science-standards.json",
    subject: "science" as const,
    name: "Science Standards",
  },
  social_studies: {
    path: "la-social-studies-standards.json",
    subject: "social_studies" as const,
    name: "Social Studies Standards",
  },
  rubric: {
    path: "la-rubric-evaluation-handbook.json",
    name: "Louisiana Educator Rubric",
  },
  leaderHandbook: {
    path: "la-leader-handbook.json",
    name: "Louisiana Leader Handbook (Coaching Content)",
  },
};

/**
 * Main execution
 */
async function main() {
  console.log(
    `${colors.bright}${colors.cyan}Pelican AI - RAG Ingestion Script${colors.reset}\n`
  );

  // Show configuration
  if (isDryRun) {
    console.log(`${colors.yellow}🔍 DRY RUN MODE - No data will be ingested${colors.reset}\n`);
  }

  if (isStandardsOnly) {
    console.log(`${colors.blue}📚 Standards only mode${colors.reset}`);
  } else if (isRubricOnly) {
    console.log(`${colors.blue}📋 Rubric only mode${colors.reset}`);
  } else if (isLeaderHandbookOnly) {
    console.log(`${colors.blue}👔 Leader Handbook only mode (coaching content)${colors.reset}`);
  } else {
    console.log(`${colors.blue}📚 Ingesting standards, rubric, and leader handbook${colors.reset}`);
  }

  if (!isRubricOnly && !isLeaderHandbookOnly) {
    console.log(
      `${colors.blue}📖 Selected subjects: ${selectedSubjects.join(", ")}${colors.reset}\n`
    );
  }

  // Initialize Convex client
  let convexUrl = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
  
  // Production mode: prompt for URL if not set
  if (isProduction && !convexUrl) {
    console.log(
      `${colors.yellow}⚠️  Production mode: CONVEX_URL not set${colors.reset}`
    );
    console.log(
      `\nPlease set CONVEX_URL environment variable:`
    );
    console.log(
      `  ${colors.bright}CONVEX_URL=https://outgoing-partridge-914.convex.cloud pnpm ingest-rag --production${colors.reset}`
    );
    console.log(
      `\nOr see PRODUCTION-DEPLOYMENT.md for alternative methods.`
    );
    process.exit(1);
  }
  
  if (!convexUrl) {
    console.error(
      `${colors.red}❌ Error: CONVEX_URL or VITE_CONVEX_URL environment variable not set${colors.reset}`
    );
    console.log(`\nMake sure .env.local exists with VITE_CONVEX_URL set`);
    console.log(`Or run ${colors.bright}pnpm convex dev${colors.reset} in another terminal`);
    process.exit(1);
  }

  // Detect and warn about production environment
  const isProdEnv = isProductionEnvironment(convexUrl);
  if (isProdEnv && !isDryRun) {
    console.log(
      `${colors.yellow}${colors.bright}⚠️  PRODUCTION ENVIRONMENT DETECTED${colors.reset}`
    );
    console.log(
      `${colors.yellow}   Target: ${convexUrl}${colors.reset}`
    );
    console.log(
      `${colors.yellow}   This will ingest data into the production database.${colors.reset}\n`
    );
    
    // Small delay to allow user to cancel if needed
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    // Process standards (unless rubric-only or leader-handbook-only)
    if (!isRubricOnly && !isLeaderHandbookOnly) {
      await processStandards(client);
    }

    // Process rubric (unless standards-only or leader-handbook-only)
    if (!isStandardsOnly && !isLeaderHandbookOnly) {
      await processRubric(client);
    }

    // Process leader handbook (always include unless standards-only or rubric-only)
    if (!isStandardsOnly && !isRubricOnly) {
      await processLeaderHandbook(client);
    }

    console.log(
      `\n${colors.green}${colors.bright}✅ Ingestion ${isDryRun ? "preview" : "complete"}!${colors.reset}\n`
    );

    if (isDryRun) {
      console.log(
        `Run without ${colors.bright}--dry-run${colors.reset} to actually ingest the data.`
      );
    }
  } catch (error) {
    console.error(
      `\n${colors.red}❌ Fatal error: ${error instanceof Error ? error.message : String(error)}${colors.reset}`
    );
    process.exit(1);
  }
}

/**
 * Process all standards files
 */
async function processStandards(client: ConvexHttpClient) {
  console.log(
    `${colors.bright}${colors.blue}Processing Standards${colors.reset}`
  );
  console.log(`${colors.dim}${"=".repeat(60)}${colors.reset}\n`);

  for (const [key, config] of Object.entries(FILES)) {
    if (key === "rubric") continue;
    // Type guard: ensure config has subject property (not rubric)
    if (!("subject" in config)) continue;
    if (!selectedSubjects.includes(config.subject)) continue;

    await processStandardsFile(
      client,
      config.path,
      config.subject,
      config.name
    );
  }
}

/**
 * Process a single standards file
 */
async function processStandardsFile(
  client: ConvexHttpClient,
  filename: string,
  subject: "ela" | "math" | "science" | "social_studies",
  displayName: string
) {
  const filePath = path.join(KNOWLEDGE_DIR, filename);

  console.log(`${colors.bright}${displayName}${colors.reset}`);
  console.log(`${colors.dim}File: ${filename}${colors.reset}`);

  try {
    // Read and parse file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    if (!data.standards || !Array.isArray(data.standards)) {
      throw new Error(`Invalid file format: missing "standards" array`);
    }

    // Transform standards to normalized format
    const standards = data.standards.map((standard: any) =>
      transformStandard(standard, subject)
    );

    console.log(`  ${colors.cyan}📊 Found ${standards.length} standards${colors.reset}`);

    // Show sample in dry-run mode
    if (isDryRun) {
      console.log(`\n  ${colors.dim}Sample standard:${colors.reset}`);
      const sample = standards[0];
      console.log(`  ${colors.dim}  Code: ${sample.code}${colors.reset}`);
      console.log(`  ${colors.dim}  Grade: ${sample.gradeLevel}${colors.reset}`);
      console.log(
        `  ${colors.dim}  Text: ${sample.text.substring(0, 60)}...${colors.reset}\n`
      );
    } else {
      // Ingest standards with retry logic for production
      console.log(`  ${colors.yellow}⏳ Ingesting...${colors.reset}`);

      let result;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          result = await client.action(api.ingestStandards.batchIngestStandards, {
            standards,
            batchSize: 50,
          });
          break; // Success, exit retry loop
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw error; // Re-throw on final attempt
          }
          console.log(
            `  ${colors.yellow}⚠️  Attempt ${attempts} failed, retrying... (${attempts}/${maxAttempts})${colors.reset}`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
        }
      }

      console.log(
        `  ${colors.green}✅ Success: ${result.successCount}/${result.total}${colors.reset}`
      );
      if (result.errorCount > 0) {
        console.log(
          `  ${colors.red}⚠️  Errors: ${result.errorCount}${colors.reset}`
        );
        if (result.errors.length > 0) {
          console.log(`  ${colors.dim}First few errors:${colors.reset}`);
          result.errors.forEach((err: any) => {
            console.log(`  ${colors.dim}  - ${err.code}: ${err.error}${colors.reset}`);
          });
        }
      }
    }
  } catch (error) {
    console.log(
      `  ${colors.red}❌ Error: ${error instanceof Error ? error.message : String(error)}${colors.reset}`
    );
  }

  console.log(); // Empty line between files
}

/**
 * Transform a standard to normalized format
 */
function transformStandard(
  standard: any,
  subject: "ela" | "math" | "science" | "social_studies"
) {
  const normalized: any = {
    code: standard.code || standard.standardCode,
    gradeLevel: standard.gradeLevel,
    subject,
    text: "",
    cognitiveDepth: undefined,
    metadata: {},
  };

  // Subject-specific transformations
  switch (subject) {
    case "ela":
      normalized.text = standard.text;
      normalized.cognitiveDepth = standard.cognitiveDepth;
      normalized.metadata = {
        strand: standard.strand,
        strandCode: standard.strandCode,
        category: standard.category,
      };
      break;

    case "math":
      normalized.text = standard.text;
      normalized.cognitiveDepth = standard.cognitiveDepth;
      normalized.metadata = {
        domain: standard.domain,
        domainCode: standard.domainCode,
        cluster: standard.cluster,
        clusterCode: standard.clusterCode,
      };
      break;

    case "science":
      normalized.text = standard.performanceExpectation;
      normalized.cognitiveDepth = standard.cognitiveDepth;
      normalized.metadata = {
        discipline: standard.discipline,
        disciplineCode: standard.disciplineCode,
        topic: standard.topic,
        performanceExpectation: standard.performanceExpectation,
        clarificationStatement: standard.clarificationStatement,
      };
      break;

    case "social_studies":
      normalized.text = standard.description;
      // Map Social Studies cognitive levels to our taxonomy
      const cognitiveMapping: Record<string, string> = {
        Recall: "recall",
        Skill: "skill",
        Analysis: "analysis",
        Synthesis: "synthesis",
        Strategic: "strategic",
        Conceptual: "conceptual",
      };
      normalized.cognitiveDepth =
        cognitiveMapping[standard.cognitiveLevel] || "recall";
      normalized.metadata = {
        contentThemes: standard.contentThemes,
        historicalEra: standard.historicalEra,
        geographicRegion: standard.geographicRegion,
      };
      break;
  }

  return normalized;
}

/**
 * Process rubric file
 */
async function processRubric(client: ConvexHttpClient) {
  console.log(
    `${colors.bright}${colors.blue}Processing Louisiana Educator Rubric${colors.reset}`
  );
  console.log(`${colors.dim}${"=".repeat(60)}${colors.reset}\n`);

  const filePath = path.join(KNOWLEDGE_DIR, FILES.rubric.path);

  try {
    // Read and parse file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    if (!data.rubric || !data.rubric.domains) {
      throw new Error(`Invalid rubric format: missing rubric.domains`);
    }

    // Extract indicators from all domains
    const indicators: Array<{
      domain: string;
      domainName: string;
      indicatorCode: string;
      indicatorName: string;
      performanceLevels: Array<{
        level: number;
        levelName: string;
        levelDescription: string;
        categoryDescription?: string;
        descriptors: string[];
      }>;
    }> = [];
    for (const domain of data.rubric.domains) {
      for (const indicator of domain.indicators) {
        indicators.push({
          domain: domain.domain,
          domainName: domain.domainName,
          indicatorCode: indicator.indicatorCode,
          indicatorName: indicator.indicatorName,
          performanceLevels: indicator.performanceLevels,
        });
      }
    }

    // Extract indicator explanations (rich coaching content)
    const indicatorExplanations: Array<{
      indicatorCode: string;
      indicatorName: string;
      domain: string;
      explanation: string;
      curriculumConnections: string;
      evidenceOfStudentLearning: string[];
      keyTerms: Record<string, string>;
      coachingQuestions: string[];
    }> = [];

    if (data.indicatorExplanations && Array.isArray(data.indicatorExplanations)) {
      for (const exp of data.indicatorExplanations) {
        indicatorExplanations.push({
          indicatorCode: exp.indicatorCode,
          indicatorName: exp.indicatorName,
          domain: exp.domain,
          explanation: exp.explanation,
          curriculumConnections: exp.curriculumConnections,
          evidenceOfStudentLearning: exp.evidenceOfStudentLearning || [],
          keyTerms: exp.keyTerms || {},
          coachingQuestions: exp.coachingQuestions || [],
        });
      }
    }

    const totalPerformanceLevels = indicators.reduce(
      (sum, ind) => sum + ind.performanceLevels.length,
      0
    );

    // Calculate expected chunks:
    // - Performance levels: one per level per indicator
    // - Summary chunks: one per indicator (if enabled)
    // - Explanations: one per indicator explanation
    // - Coaching questions: one per indicator explanation
    // - System chunks: LEADS + rubric overview
    const expectedChunks = {
      performanceLevels: totalPerformanceLevels,
      summaries: indicators.length, // generateSummaryChunks: true
      explanations: indicatorExplanations.length,
      coachingQuestions: indicatorExplanations.length,
      system: 2, // LEADS + rubric overview
    };
    const totalExpected = Object.values(expectedChunks).reduce((a, b) => a + b, 0);

    console.log(
      `  ${colors.cyan}📊 Found ${indicators.length} indicators:${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${expectedChunks.performanceLevels} performance level chunks${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${expectedChunks.summaries} summary chunks (for level comparison)${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${expectedChunks.explanations} explanation chunks (rich coaching content)${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${expectedChunks.coachingQuestions} coaching question chunks${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${expectedChunks.system} system chunks (LEADS + overview)${colors.reset}`
    );
    console.log(
      `  ${colors.cyan}     = ${totalExpected} total chunks${colors.reset}`
    );

    // Show sample in dry-run mode
    if (isDryRun) {
      console.log(`\n  ${colors.dim}Sample indicator:${colors.reset}`);
      const sample = indicators[0];
      console.log(
        `  ${colors.dim}  Domain: ${sample.domainName}${colors.reset}`
      );
      console.log(
        `  ${colors.dim}  Indicator: ${sample.indicatorCode} - ${sample.indicatorName}${colors.reset}`
      );
      console.log(
        `  ${colors.dim}  Performance Levels: ${sample.performanceLevels.length}${colors.reset}`
      );

      // Show sample explanation if available
      if (indicatorExplanations.length > 0) {
        const sampleExp = indicatorExplanations[0];
        console.log(`\n  ${colors.dim}Sample explanation:${colors.reset}`);
        console.log(
          `  ${colors.dim}  Indicator: ${sampleExp.indicatorCode} - ${sampleExp.indicatorName}${colors.reset}`
        );
        console.log(
          `  ${colors.dim}  Explanation: ${sampleExp.explanation.substring(0, 100)}...${colors.reset}`
        );
        console.log(
          `  ${colors.dim}  Key Terms: ${Object.keys(sampleExp.keyTerms).length} definitions${colors.reset}`
        );
        console.log(
          `  ${colors.dim}  Coaching Questions: ${sampleExp.coachingQuestions.length} questions${colors.reset}`
        );
        console.log(
          `  ${colors.dim}  Evidence Examples: ${sampleExp.evidenceOfStudentLearning.length} examples${colors.reset}\n`
        );
      }
    } else {
      // Ingest rubric with retry logic for production
      console.log(`  ${colors.yellow}⏳ Ingesting...${colors.reset}`);

      let result;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          result = await client.action(api.ingestRubric.batchIngestRubric, {
            indicators,
            leadsSystem: data.leadsSystem,
            rubricMetadata: {
              name: data.rubric.name,
              releaseDate: data.rubric.releaseDate,
              overview: data.rubric.overview,
              performanceLevelGuidance: data.rubric.performanceLevelGuidance,
            },
            // NEW: Include rich coaching content
            indicatorExplanations: indicatorExplanations.length > 0 ? indicatorExplanations : undefined,
            // NEW: Generate summary chunks for level comparison queries
            generateSummaryChunks: true,
          });
          break; // Success, exit retry loop
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw error; // Re-throw on final attempt
          }
          console.log(
            `  ${colors.yellow}⚠️  Attempt ${attempts} failed, retrying... (${attempts}/${maxAttempts})${colors.reset}`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
        }
      }

      console.log(
        `  ${colors.green}✅ Success: ${result.successCount}/${result.total}${colors.reset}`
      );

      // Show breakdown if available
      if (result.breakdown) {
        console.log(`  ${colors.dim}Breakdown:${colors.reset}`);
        console.log(`  ${colors.dim}  • Performance levels: ${result.breakdown.performanceLevels}${colors.reset}`);
        console.log(`  ${colors.dim}  • Summaries: ${result.breakdown.summaries}${colors.reset}`);
        console.log(`  ${colors.dim}  • Explanations: ${result.breakdown.explanations}${colors.reset}`);
        console.log(`  ${colors.dim}  • Coaching questions: ${result.breakdown.coachingQuestions}${colors.reset}`);
        console.log(`  ${colors.dim}  • System: ${result.breakdown.system}${colors.reset}`);
      }

      if (result.errorCount > 0) {
        console.log(
          `  ${colors.red}⚠️  Errors: ${result.errorCount}${colors.reset}`
        );
        if (result.errors.length > 0) {
          console.log(`  ${colors.dim}First few errors:${colors.reset}`);
          result.errors.forEach((err: any) => {
            console.log(`  ${colors.dim}  - ${err.code}: ${err.error}${colors.reset}`);
          });
        }
      }
    }
  } catch (error) {
    console.log(
      `  ${colors.red}❌ Error: ${error instanceof Error ? error.message : String(error)}${colors.reset}`
    );
  }

  console.log(); // Empty line
}

/**
 * Process Leader Handbook (coaching content)
 */
async function processLeaderHandbook(client: ConvexHttpClient) {
  console.log(
    `${colors.bright}${colors.blue}Processing Louisiana Leader Handbook${colors.reset}`
  );
  console.log(`${colors.dim}${"=".repeat(60)}${colors.reset}\n`);
  console.log(
    `${colors.dim}Extracting coaching questions, evidence examples, and adult learning principles${colors.reset}\n`
  );

  const filePath = path.join(KNOWLEDGE_DIR, FILES.leaderHandbook.path);

  try {
    // Read and parse file
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    // Extract indicator explanations (coaching questions and evidence examples)
    const indicatorExplanations: Array<{
      indicatorCode: string;
      indicatorName: string;
      indicatorNumber: string;
      domain: string;
      explanation: string;
      descriptorExplanations?: Record<string, string>;
      evidenceExamples: string[];
      coachingQuestions: string[];
    }> = [];

    if (data.indicatorExplanations && Array.isArray(data.indicatorExplanations)) {
      for (const exp of data.indicatorExplanations) {
        indicatorExplanations.push({
          indicatorCode: exp.indicatorCode,
          indicatorName: exp.indicatorName,
          indicatorNumber: exp.indicatorNumber,
          domain: exp.domain,
          explanation: exp.explanation,
          descriptorExplanations: exp.descriptorExplanations,
          evidenceExamples: exp.evidenceExamples || [],
          coachingQuestions: exp.coachingQuestions || [],
        });
      }
    }

    // Extract adult learning principles
    const adultLearningPrinciples: Array<{ principle: string; description: string }> = [];
    if (data.adultLearningPrinciples?.principles) {
      for (const p of data.adultLearningPrinciples.principles) {
        adultLearningPrinciples.push({
          principle: p.principle,
          description: p.description,
        });
      }
    }

    // Count totals
    const coachingCount = indicatorExplanations.filter(
      (e) => e.coachingQuestions.length > 0
    ).length;
    const evidenceCount = indicatorExplanations.filter(
      (e) => e.evidenceExamples.length > 0
    ).length;
    const totalCoachingQuestions = indicatorExplanations.reduce(
      (sum, e) => sum + e.coachingQuestions.length,
      0
    );
    const totalEvidenceExamples = indicatorExplanations.reduce(
      (sum, e) => sum + e.evidenceExamples.length,
      0
    );

    console.log(
      `  ${colors.cyan}📊 Found coaching content:${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${coachingCount} indicators with coaching questions (${totalCoachingQuestions} questions total)${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${evidenceCount} indicators with evidence examples (${totalEvidenceExamples} examples total)${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${adultLearningPrinciples.length} adult learning principles${colors.reset}`
    );
    console.log(
      `  ${colors.dim}     • ${data.leadsSystem?.leadershipBeliefs?.length || 0} leadership beliefs${colors.reset}`
    );

    // Show sample in dry-run mode
    if (isDryRun) {
      if (indicatorExplanations.length > 0) {
        const sampleExp = indicatorExplanations[0];
        console.log(`\n  ${colors.dim}Sample coaching questions (${sampleExp.indicatorCode} - ${sampleExp.indicatorName}):${colors.reset}`);
        sampleExp.coachingQuestions.slice(0, 3).forEach((q, i) => {
          console.log(`  ${colors.dim}  ${i + 1}. ${q}${colors.reset}`);
        });
        if (sampleExp.coachingQuestions.length > 3) {
          console.log(`  ${colors.dim}  ... and ${sampleExp.coachingQuestions.length - 3} more${colors.reset}`);
        }
      }

      if (adultLearningPrinciples.length > 0) {
        console.log(`\n  ${colors.dim}Sample adult learning principle:${colors.reset}`);
        console.log(`  ${colors.dim}  ${adultLearningPrinciples[0].principle}: ${adultLearningPrinciples[0].description.substring(0, 100)}...${colors.reset}\n`);
      }
    } else {
      // Ingest leader handbook content
      console.log(`  ${colors.yellow}⏳ Ingesting...${colors.reset}`);

      let result;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        try {
          result = await client.action(api.ingestLeaderHandbook.batchIngestLeaderHandbook, {
            indicatorExplanations,
            adultLearningPrinciples: adultLearningPrinciples.length > 0 ? adultLearningPrinciples : undefined,
            leadsSystem: data.leadsSystem,
          });
          break; // Success, exit retry loop
        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw error; // Re-throw on final attempt
          }
          console.log(
            `  ${colors.yellow}⚠️  Attempt ${attempts} failed, retrying... (${attempts}/${maxAttempts})${colors.reset}`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempts)); // Exponential backoff
        }
      }

      console.log(
        `  ${colors.green}✅ Success: ${result.successCount}/${result.total}${colors.reset}`
      );

      // Show breakdown if available
      if (result.breakdown) {
        console.log(`  ${colors.dim}Breakdown:${colors.reset}`);
        console.log(`  ${colors.dim}  • Coaching questions: ${result.breakdown.coachingQuestions}${colors.reset}`);
        console.log(`  ${colors.dim}  • Evidence examples: ${result.breakdown.evidenceExamples}${colors.reset}`);
        console.log(`  ${colors.dim}  • Adult learning principles: ${result.breakdown.adultLearningPrinciples}${colors.reset}`);
        console.log(`  ${colors.dim}  • Leadership beliefs: ${result.breakdown.leadershipBeliefs}${colors.reset}`);
      }

      if (result.errorCount > 0) {
        console.log(
          `  ${colors.red}⚠️  Errors: ${result.errorCount}${colors.reset}`
        );
        if (result.errors.length > 0) {
          console.log(`  ${colors.dim}First few errors:${colors.reset}`);
          result.errors.forEach((err: any) => {
            console.log(`  ${colors.dim}  - ${err.code}: ${err.error}${colors.reset}`);
          });
        }
      }
    }
  } catch (error) {
    console.log(
      `  ${colors.red}❌ Error: ${error instanceof Error ? error.message : String(error)}${colors.reset}`
    );
  }

  console.log(); // Empty line
}

// Run the script
main();
