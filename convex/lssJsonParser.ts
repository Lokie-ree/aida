/**
 * ✅ ACTIVE - Used in production
 * JSON parser for Louisiana Student Standards
 * 
 * Parses and validates JSON content against the LSS standard schema
 */

/**
 * Standard data structure matching the JSON schema
 * (Shared type definition - also used in scripts/convert-markdown-to-json.ts)
 */
export interface LSSStandard {
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
 * Standard data structure matching populateStandards.ts interface
 */
export interface StandardData {
  standardCode: string;
  gradeLevel: string;
  subject: string;
  standardText: string;
  performanceExpectations?: string;
  cognitiveDepth?: "recall" | "application" | "synthesis";
  strand?: string; // ELA only
  domain?: string; // Math only
  cluster?: string; // Math only
  subStandard?: string;
  course?: string; // High school Math only
}

/**
 * Validate a single standard object against schema requirements
 */
function validateStandard(standard: any): standard is LSSStandard {
  // Required fields
  if (!standard.standardCode || typeof standard.standardCode !== "string") {
    return false;
  }
  if (!standard.gradeLevel || typeof standard.gradeLevel !== "string") {
    return false;
  }
  if (!standard.subject || typeof standard.subject !== "string") {
    return false;
  }
  if (!standard.standardText || typeof standard.standardText !== "string") {
    return false;
  }

  // Subject enum validation
  const validSubjects = ["ela", "math", "science", "social_studies"];
  if (!validSubjects.includes(standard.subject)) {
    return false;
  }

  // Grade level validation
  const validGrades = [
    "K",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "9-10",
    "11-12",
  ];
  if (!validGrades.includes(standard.gradeLevel)) {
    return false;
  }

  // Cognitive depth validation (if present)
  if (
    standard.cognitiveDepth &&
    !["recall", "application", "synthesis"].includes(standard.cognitiveDepth)
  ) {
    return false;
  }

  // ELA-specific: strand validation (only validate if strand is present)
  // If strand is present for ELA, it must be valid
  if (standard.subject === "ela" && standard.strand) {
    const validStrands = ["RL", "RI", "RF", "W", "SL", "L", "RH", "RST", "WHST"];
    if (!validStrands.includes(standard.strand)) {
      return false;
    }
  }

  // Math-specific: course validation (high school) - only validate if course is present
  // If course is present for Math, it must be valid
  if (standard.subject === "math" && standard.course) {
    const validCourses = ["A1", "GM", "A2"];
    if (!validCourses.includes(standard.course)) {
      return false;
    }
  }

  return true;
}

/**
 * Parse JSON content and return structured StandardData array
 * 
 * @param jsonContent - JSON string containing array of standards
 * @returns Array of validated StandardData objects
 * @throws Error if JSON is invalid or standards fail validation
 */
export function parseLSSJSON(jsonContent: string): StandardData[] {
  let parsed: any;
  
  try {
    parsed = JSON.parse(jsonContent);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON must contain an array of standards");
  }

  const standards: StandardData[] = [];
  const errors: string[] = [];

  for (let i = 0; i < parsed.length; i++) {
    const standard = parsed[i];
    
    if (!validateStandard(standard)) {
      errors.push(
        `Standard at index ${i} (code: ${standard.standardCode || "unknown"}) failed validation`
      );
      continue;
    }

    // Convert LSSStandard to StandardData format
    const standardData: StandardData = {
      standardCode: standard.standardCode,
      gradeLevel: standard.gradeLevel,
      subject: standard.subject,
      standardText: standard.standardText,
      cognitiveDepth: standard.cognitiveDepth,
      performanceExpectations: standard.performanceExpectations,
      strand: standard.strand,
      domain: standard.domain,
      cluster: standard.cluster,
      subStandard: standard.subStandard,
      course: standard.course,
    };

    standards.push(standardData);
  }

  if (errors.length > 0 && standards.length === 0) {
    throw new Error(`All standards failed validation:\n${errors.join("\n")}`);
  }

  if (errors.length > 0) {
    console.warn(`Some standards failed validation:\n${errors.join("\n")}`);
  }

  return standards;
}

