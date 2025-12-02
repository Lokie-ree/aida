#!/usr/bin/env tsx
/**
 * RAG Ingestion Script
 *
 * Reads Louisiana Student Standards and Educator Rubric JSON files
 * and ingests them into the Convex RAG system.
 *
 * Usage:
 *   pnpm ingest-rag                    # Ingest all files
 *   pnpm ingest-rag --dry-run          # Preview without ingesting
 *   pnpm ingest-rag --subjects ela,math # Ingest specific subjects only
 *   pnpm ingest-rag --rubric-only      # Ingest only the rubric
 *   pnpm ingest-rag --standards-only   # Ingest only standards
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
const subjectsArg = args.find((arg) => arg.startsWith("--subjects="));
const selectedSubjects = subjectsArg
  ? subjectsArg.split("=")[1].split(",")
  : ["ela", "math", "science", "social_studies"];

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
  } else {
    console.log(`${colors.blue}📚 Ingesting both standards and rubric${colors.reset}`);
  }

  if (!isRubricOnly) {
    console.log(
      `${colors.blue}📖 Selected subjects: ${selectedSubjects.join(", ")}${colors.reset}\n`
    );
  }

  // Initialize Convex client
  const convexUrl = process.env.CONVEX_URL || process.env.VITE_CONVEX_URL;
  if (!convexUrl) {
    console.error(
      `${colors.red}❌ Error: CONVEX_URL or VITE_CONVEX_URL environment variable not set${colors.reset}`
    );
    console.log(`\nMake sure .env.local exists with VITE_CONVEX_URL set`);
    console.log(`Or run ${colors.bright}pnpm convex dev${colors.reset} in another terminal`);
    process.exit(1);
  }

  const client = new ConvexHttpClient(convexUrl);

  try {
    // Process standards
    if (!isRubricOnly) {
      await processStandards(client);
    }

    // Process rubric
    if (!isStandardsOnly) {
      await processRubric(client);
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
      // Ingest standards
      console.log(`  ${colors.yellow}⏳ Ingesting...${colors.reset}`);

      const result = await client.action(api.ingestStandards.batchIngestStandards, {
        standards,
        batchSize: 50,
      });

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
        Skill: "application",
        Analysis: "analysis",
        Synthesis: "synthesis",
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
    const indicators = [];
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

    const totalChunks = indicators.reduce(
      (sum, ind) => sum + ind.performanceLevels.length,
      0
    );

    console.log(
      `  ${colors.cyan}📊 Found ${indicators.length} indicators (${totalChunks} performance levels)${colors.reset}`
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
        `  ${colors.dim}  Performance Levels: ${sample.performanceLevels.length}${colors.reset}\n`
      );
    } else {
      // Ingest rubric
      console.log(`  ${colors.yellow}⏳ Ingesting...${colors.reset}`);

      const result = await client.action(api.ingestRubric.batchIngestRubric, {
        indicators,
        leadsSystem: data.leadsSystem,
        rubricMetadata: {
          name: data.rubric.name,
          releaseDate: data.rubric.releaseDate,
          overview: data.rubric.overview,
          performanceLevelGuidance: data.rubric.performanceLevelGuidance,
        },
      });

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

  console.log(); // Empty line
}

// Run the script
main();
