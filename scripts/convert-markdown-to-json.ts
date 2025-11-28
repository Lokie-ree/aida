/**
 * One-time script to convert markdown knowledge files to JSON
 * 
 * Run this script locally to generate JSON files from markdown:
 *   pnpm tsx scripts/convert-markdown-to-json.ts
 * 
 * This is NOT a Convex function - it's a local Node.js script.
 * After running, commit the generated JSON files to git.
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

/**
 * Standard data structure matching the JSON schema
 */
interface LSSStandard {
  standardCode: string;
  gradeLevel: string;
  subject: "ela" | "math" | "science" | "social_studies";
  standardText: string;
  strand?: string; // ELA only: RL, RI, RF, W, SL, L, RH, RST, WHST
  domain?: string; // Math only: NBT, OA, NF, etc.
  cluster?: string; // Math only: A, B, C, etc.
  subStandard?: string; // Letter suffix: a, b, c, etc.
  performanceExpectations?: string;
  cognitiveDepth?: "recall" | "application" | "synthesis";
  course?: string; // High school Math only: A1, GM, A2
}

/**
 * Parse ELA standard code (e.g., "RL.2.1", "W.9-10.1a", "RL.11-12.1")
 * Format: [STRAND].[GRADE].[STANDARD#][LETTER]
 */
function parseELAStandardCode(code: string): {
  strand: string;
  gradeLevel: string;
  standardNumber: string;
  subStandard?: string;
} {
  // Match pattern: RL.2.1 or W.9-10.1a or RL.11-12.1
  // Handles both single grades (2) and grade ranges (9-10, 11-12)
  const match = code.match(/^([A-Z]{2,4})\.([0-9]+(?:-[0-9]+)?)\.([0-9]+)([a-z])?$/);
  if (!match) {
    throw new Error(`Invalid ELA standard code format: ${code}`);
  }

  return {
    strand: match[1],
    gradeLevel: match[2],
    standardNumber: match[3],
    subStandard: match[4],
  };
}

/**
 * Parse Math K-8 standard code (e.g., "3.NBT.A.3")
 * Format: [GRADE].[DOMAIN].[CLUSTER].[STANDARD#]
 */
function parseMathK8StandardCode(code: string): {
  gradeLevel: string;
  domain: string;
  cluster: string;
  standardNumber: string;
} {
  const match = code.match(/^([0-9]+)\.([A-Z]+)\.([A-Z])\.([0-9]+)$/);
  if (!match) {
    throw new Error(`Invalid Math K-8 standard code format: ${code}`);
  }

  return {
    gradeLevel: match[1],
    domain: match[2],
    cluster: match[3],
    standardNumber: match[4],
  };
}

/**
 * Parse Math high school standard code (e.g., "GM: G-SRT.B.5")
 * Format: [COURSE]: [CATEGORY]-[DOMAIN].[CLUSTER].[STANDARD#]
 */
function parseMathHSStandardCode(code: string): {
  course: string;
  category: string;
  domain: string;
  cluster: string;
  standardNumber: string;
} {
  const match = code.match(/^([A-Z0-9]+):\s*([A-Z])-([A-Z]+)\.([A-Z])\.([0-9]+)$/);
  if (!match) {
    throw new Error(`Invalid Math high school standard code format: ${code}`);
  }

  return {
    course: match[1],
    category: match[2],
    domain: match[3],
    cluster: match[4],
    standardNumber: match[5],
  };
}

/**
 * Infer cognitive depth from standard text
 * Simple heuristic based on key verbs
 */
function inferCognitiveDepth(text: string): "recall" | "application" | "synthesis" {
  const lowerText = text.toLowerCase();
  
  // Synthesis indicators
  if (
    lowerText.includes("analyze") ||
    lowerText.includes("synthesize") ||
    lowerText.includes("evaluate") ||
    lowerText.includes("create") ||
    lowerText.includes("design") ||
    lowerText.includes("construct")
  ) {
    return "synthesis";
  }
  
  // Application indicators
  if (
    lowerText.includes("apply") ||
    lowerText.includes("use") ||
    lowerText.includes("demonstrate") ||
    lowerText.includes("solve") ||
    lowerText.includes("implement") ||
    lowerText.includes("fluently") ||
    lowerText.includes("multiply") ||
    lowerText.includes("find") ||
    lowerText.includes("write") ||
    lowerText.includes("calculate")
  ) {
    return "application";
  }
  
  // Default to recall
  return "recall";
}

/**
 * Convert ELA markdown to JSON standards
 */
function convertELAMarkdown(markdown: string): LSSStandard[] {
  const standards: LSSStandard[] = [];
  const lines = markdown.split("\n");
  let currentGradeLevel: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Update grade level from headers
    const gradeMatch = line.match(/^#+\s*(?:Grade\s+)?([K0-9]+(?:-[0-9]+)?)/i);
    if (gradeMatch) {
      const grade = gradeMatch[1].toUpperCase();
      currentGradeLevel = grade === "KINDERGARTEN" || grade === "K" ? "K" : grade;
      continue;
    }

    // Match ELA standard patterns: "**RL.2.1**: Text here" or "- **RL.2.1**: Text here"
    // Also handles sub-standards like "W.9-10.1a" and grade ranges like "RL.11-12.1"
    // Try with colon first, then without colon
    let standardMatch = line.match(/^[-*]?\s*\*\*([A-Z]{2,4}\.[0-9]+(?:-[0-9]+)?\.[0-9]+[a-z]?)\*\*:\s*(.+)$/);
    if (!standardMatch) {
      // Try without colon (some formats might not have it)
      standardMatch = line.match(/^[-*]?\s*\*\*([A-Z]{2,4}\.[0-9]+(?:-[0-9]+)?\.[0-9]+[a-z]?)\*\*\s+(.+)$/);
    }
    
    if (standardMatch) {
      const code = standardMatch[1];
      let text = standardMatch[2];
      
      // Collect continuation lines until next standard or empty line
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        // Stop at empty line, next standard, or section header
        if (
          nextLine === "" ||
          nextLine.match(/^[-*]?\s*\*\*[A-Z]{2,4}\./) ||
          nextLine.match(/^#+\s/)
        ) {
          break;
        }
        // Include continuation lines (even if indented, they're part of the standard)
        // But skip if it's a sub-bullet that starts with "-" or "*" at the beginning
        if (!nextLine.match(/^[-*]\s+[a-z]/)) {
          text += " " + nextLine;
        }
        j++;
      }

      try {
        const parsed = parseELAStandardCode(code);
        const gradeLevel = parsed.gradeLevel || currentGradeLevel || "unknown";
        
        standards.push({
          standardCode: code,
          gradeLevel,
          subject: "ela",
          standardText: text.trim(),
          strand: parsed.strand,
          subStandard: parsed.subStandard,
          cognitiveDepth: inferCognitiveDepth(text),
        });
      } catch (error) {
        console.warn(`Failed to parse ELA standard ${code}: ${error}`);
      }
    }
  }

  return standards;
}

/**
 * Convert Math markdown to JSON standards
 */
function convertMathMarkdown(markdown: string): LSSStandard[] {
  const standards: LSSStandard[] = [];
  const lines = markdown.split("\n");
  let currentGradeLevel: string | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Update grade level from headers
    const gradeMatch = line.match(/^#+\s*(?:Grade\s+)?([K0-9]+(?:-[0-9]+)?)/i);
    if (gradeMatch) {
      const grade = gradeMatch[1].toUpperCase();
      currentGradeLevel = grade === "KINDERGARTEN" || grade === "K" ? "K" : grade;
      continue;
    }

    // Match Math K-8 standard: "3.NBT.A.3. Text here"
    const k8Match = line.match(/^([0-9]+\.[A-Z]+\.[A-Z]\.[0-9]+)\.\s*(.+)$/);
    if (k8Match) {
      const code = k8Match[1];
      let text = k8Match[2];
      
      // Collect continuation lines
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (nextLine === "" || nextLine.match(/^[0-9]+\.[A-Z]+\./) || nextLine.match(/^[A-Z0-9]+:\s*[A-Z]-/)) {
          break;
        }
        text += " " + nextLine;
        j++;
      }

      try {
        const parsed = parseMathK8StandardCode(code);
        
        standards.push({
          standardCode: code,
          gradeLevel: parsed.gradeLevel,
          subject: "math",
          standardText: text.trim(),
          domain: parsed.domain,
          cluster: parsed.cluster,
          cognitiveDepth: inferCognitiveDepth(text),
        });
      } catch (error) {
        console.warn(`Failed to parse Math K-8 standard ${code}: ${error}`);
      }
      continue;
    }

    // Match Math high school standard: "GM: G-SRT.B.5. Text here"
    const hsMatch = line.match(/^([A-Z0-9]+):\s*([A-Z]-[A-Z]+\.[A-Z]\.[0-9]+)\.\s*(.+)$/);
    if (hsMatch) {
      const course = hsMatch[1];
      const code = `${course}: ${hsMatch[2]}`;
      let text = hsMatch[3];
      
      // Collect continuation lines
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j].trim();
        if (nextLine === "" || nextLine.match(/^[A-Z0-9]+:\s*[A-Z]-/)) {
          break;
        }
        text += " " + nextLine;
        j++;
      }

      try {
        const parsed = parseMathHSStandardCode(code);
        
        standards.push({
          standardCode: code,
          gradeLevel: "9-10", // High school standards typically span 9-10 or 11-12
          subject: "math",
          standardText: text.trim(),
          course: parsed.course,
          domain: parsed.domain,
          cluster: parsed.cluster,
          cognitiveDepth: inferCognitiveDepth(text),
        });
      } catch (error) {
        console.warn(`Failed to parse Math HS standard ${code}: ${error}`);
      }
    }
  }

  return standards;
}

/**
 * Convert markdown content to JSON standards array
 */
function convertMarkdownToJSON(
  markdownContent: string,
  subject: "ela" | "math" | "science" | "social_studies"
): LSSStandard[] {
  switch (subject) {
    case "ela":
      return convertELAMarkdown(markdownContent);
    case "math":
      return convertMathMarkdown(markdownContent);
    case "science":
    case "social_studies":
      console.warn(`Subject ${subject} parser not yet implemented`);
      return [];
    default:
      throw new Error(`Unsupported subject: ${subject}`);
  }
}

/**
 * Main conversion function
 */
function convertFile(inputPath: string, outputPath: string, subject: "ela" | "math" | "science" | "social_studies") {
  console.log(`\n📄 Converting ${inputPath} to ${outputPath}...`);
  
  try {
    const markdown = readFileSync(inputPath, "utf-8");
    const standards = convertMarkdownToJSON(markdown, subject);
    
    if (standards.length === 0) {
      console.warn(`⚠️  No standards found in ${inputPath}`);
      return;
    }
    
    const json = JSON.stringify(standards, null, 2);
    writeFileSync(outputPath, json, "utf-8");
    
    console.log(`✅ Converted ${standards.length} standards to ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error converting ${inputPath}:`, error);
    throw error;
  }
}

/**
 * Run conversions
 */
function main() {
  console.log("🔄 Converting markdown knowledge files to JSON...\n");
  
  const knowledgeDir = join(rootDir, "knowledge");
  
  // Convert ELA
  convertFile(
    join(knowledgeDir, "la-ela.md"),
    join(knowledgeDir, "la-ela.json"),
    "ela"
  );
  
  // Convert Math
  convertFile(
    join(knowledgeDir, "la-math.md"),
    join(knowledgeDir, "la-math.json"),
    "math"
  );
  
  // TODO: Add science and social studies when parsers are implemented
  
  console.log("\n✅ All conversions complete!");
  console.log("\n📝 Next steps:");
  console.log("1. Review generated JSON files in knowledge/");
  console.log("2. Commit JSON files to git: git add knowledge/*.json");
  console.log("3. Use populateStandardsFromJson action to populate RAG");
  console.log("   npx convex run populateStandardsWorkflow:startPopulateStandardsWorkflow \\");
  console.log("     --jsonContent \"$(cat knowledge/la-ela.json)\" \\");
  console.log("     --subject ela");
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
