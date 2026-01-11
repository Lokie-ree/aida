/**
 * Smart Profile Detection
 * 
 * Parses user messages to detect grade level and subject information.
 * Used to offer one-click profile completion after the first AI response.
 */

export interface DetectedProfile {
  gradeLevel?: string;
  subject?: string;
  confidence: "high" | "medium" | "low";
}

/**
 * Grade level detection patterns.
 * Order matters - more specific patterns should come first.
 */
const GRADE_PATTERNS: Array<{
  pattern: RegExp;
  value?: string;
  extract?: boolean;
}> = [
  // Specific grade patterns
  { pattern: /\b(pre-?k|prek)\b/i, value: "Pre-K" },
  { pattern: /\bkindergarten\b/i, value: "K" },
  // "5th grade", "5th-grade", "fifth grade"
  { pattern: /\b(\d+)(?:st|nd|rd|th)?[\s-]*grade\b/i, extract: true },
  // "grade 5", "grade-5"
  { pattern: /\bgrade[\s-]*(\d+)\b/i, extract: true },
  // Range patterns like "9-12", "K-5" (for high school, elementary)
  { pattern: /\b(k-5|k-2|3-5)\b/i, value: "K-5" },
  { pattern: /\b(6-8)\b/i, value: "6-8" },
  { pattern: /\b(9-12)\b/i, value: "9-12" },
  // General school level patterns (lower priority)
  { pattern: /\b(elementary|primary)\s*(school)?\b/i, value: "K-5" },
  { pattern: /\b(middle)\s*(school)?\b/i, value: "6-8" },
  { pattern: /\b(high)\s*(school)?\b/i, value: "9-12" },
];

/**
 * Subject detection patterns.
 * Maps various ways teachers describe subjects to standardized values.
 */
const SUBJECT_PATTERNS: Array<{
  pattern: RegExp;
  value: string;
}> = [
  // Math variants
  {
    pattern: /\b(math|mathematics|algebra|geometry|calculus|pre-?algebra|trigonometry)\b/i,
    value: "Mathematics",
  },
  // ELA variants
  {
    pattern: /\b(ela|english|reading|writing|literacy|language\s*arts|literature)\b/i,
    value: "ELA",
  },
  // Science variants
  {
    pattern: /\b(science|biology|chemistry|physics|earth\s*science|life\s*science|physical\s*science)\b/i,
    value: "Science",
  },
  // Social Studies variants
  {
    pattern: /\b(social\s*studies|history|geography|civics|government|economics)\b/i,
    value: "Social Studies",
  },
  // Special Education
  {
    pattern: /\b(sped|special\s*ed|special\s*education)\b/i,
    value: "Special Education",
  },
  // Arts
  {
    pattern: /\b(art|music|theater|drama|band|choir|orchestra)\b/i,
    value: "Arts",
  },
  // Physical Education
  {
    pattern: /\b(pe|physical\s*education|gym|health)\b/i,
    value: "Physical Education",
  },
  // World Languages
  {
    pattern: /\b(spanish|french|german|chinese|mandarin|latin|foreign\s*language|world\s*language)\b/i,
    value: "World Languages",
  },
];

/**
 * Normalize extracted grade number to a standard format.
 * Converts numeric grades to ordinal form (e.g., "5" -> "5th Grade").
 */
function normalizeGradeNumber(grade: string): string {
  const num = parseInt(grade, 10);
  if (isNaN(num) || num < 1 || num > 12) {
    return grade;
  }
  
  const suffix = 
    num === 1 ? "st" :
    num === 2 ? "nd" :
    num === 3 ? "rd" : "th";
  
  return `${num}${suffix} Grade`;
}

/**
 * Detects grade level and subject from a user's message.
 * 
 * @param message - The user's chat message
 * @returns DetectedProfile with grade, subject, and confidence level
 * 
 * @example
 * detectProfileFromMessage("I'm teaching 5th grade math fractions")
 * // Returns: { gradeLevel: "5th Grade", subject: "Mathematics", confidence: "high" }
 */
export function detectProfileFromMessage(message: string): DetectedProfile | null {
  let gradeLevel: string | undefined;
  let subject: string | undefined;

  // Detect grade level
  for (const { pattern, value, extract } of GRADE_PATTERNS) {
    const match = message.match(pattern);
    if (match) {
      if (extract && match[1]) {
        gradeLevel = normalizeGradeNumber(match[1]);
      } else if (value) {
        gradeLevel = value;
      }
      break; // Use first match
    }
  }

  // Detect subject
  for (const { pattern, value } of SUBJECT_PATTERNS) {
    if (pattern.test(message)) {
      subject = value;
      break; // Use first match
    }
  }

  // Return null if nothing detected
  if (!gradeLevel && !subject) {
    return null;
  }

  // Determine confidence level
  const confidence: DetectedProfile["confidence"] =
    gradeLevel && subject ? "high" :
    gradeLevel || subject ? "medium" : "low";

  return {
    gradeLevel,
    subject,
    confidence,
  };
}

/**
 * Storage key for tracking if we've already offered profile detection to the user.
 */
export const PROFILE_DETECTION_OFFERED_KEY = "pelican-profile-detection-offered";

/**
 * Check if we've already offered profile detection to this user.
 */
export function hasOfferedProfileDetection(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PROFILE_DETECTION_OFFERED_KEY) === "true";
}

/**
 * Mark that we've offered profile detection to this user.
 */
export function markProfileDetectionOffered(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_DETECTION_OFFERED_KEY, "true");
}

/**
 * Clear the profile detection offered flag (for testing or reset).
 */
export function clearProfileDetectionOffered(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROFILE_DETECTION_OFFERED_KEY);
}
