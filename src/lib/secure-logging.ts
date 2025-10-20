/**
 * Secure Logging Utility for FERPA Compliance
 * 
 * This utility provides secure logging functions that automatically redact
 * Personally Identifiable Information (PII) to ensure FERPA compliance.
 * 
 * @see https://www2.ed.gov/policy/gen/guid/fpco/ferpa/index.html
 */

/**
 * Fields that contain PII and should be redacted from logs
 */
const PII_FIELDS = [
  'email',
  'name', 
  'firstName',
  'lastName',
  'phone',
  'address',
  'school',
  'district',
  'studentId',
  'ssn',
  'socialSecurityNumber',
  'dateOfBirth',
  'birthDate',
  'mothersMaidenName',
  'personalInfo',
  'pii'
] as const;

/**
 * Redacts PII from an object by replacing sensitive values with safe placeholders
 * 
 * @param data - Object that may contain PII
 * @returns Object with PII redacted
 */
function redactPII<T extends Record<string, any>>(data: T): T {
  const redacted = { ...data } as any;
  
  for (const field of PII_FIELDS) {
    if (field in redacted && redacted[field] !== undefined) {
      redacted[field] = '[REDACTED]';
    }
  }
  
  return redacted as T;
}

/**
 * Secure console.log that automatically redacts PII
 * 
 * @param message - Log message
 * @param data - Optional data object (PII will be redacted)
 */
export function secureLog(message: string, data?: Record<string, any>): void {
  if (data) {
    const redactedData = redactPII(data);
    console.log(message, redactedData);
  } else {
    console.log(message);
  }
}

/**
 * Secure console.error that automatically redacts PII
 * 
 * @param message - Error message
 * @param error - Optional error object (PII will be redacted)
 */
export function secureError(message: string, error?: any): void {
  if (error && typeof error === 'object') {
    const redactedError = redactPII(error);
    console.error(message, redactedError);
  } else {
    console.error(message, error);
  }
}

/**
 * Secure console.warn that automatically redacts PII
 * 
 * @param message - Warning message
 * @param data - Optional data object (PII will be redacted)
 */
export function secureWarn(message: string, data?: Record<string, any>): void {
  if (data) {
    const redactedData = redactPII(data);
    console.warn(message, redactedData);
  } else {
    console.warn(message);
  }
}

/**
 * Creates a secure logging context for authentication operations
 * 
 * @param operation - Name of the authentication operation
 * @param userId - User ID (safe to log)
 * @returns Object with secure logging methods
 */
export function createAuthLogContext(operation: string, userId?: string) {
  const baseData = {
    operation,
    userId: userId || '[UNKNOWN]',
    timestamp: Date.now()
  };

  return {
    log: (message: string, additionalData?: Record<string, any>) => {
      secureLog(`[AUTH:${operation}] ${message}`, { ...baseData, ...additionalData });
    },
    error: (message: string, error?: any) => {
      secureError(`[AUTH:${operation}] ${message}`, { ...baseData, error });
    },
    warn: (message: string, additionalData?: Record<string, any>) => {
      secureWarn(`[AUTH:${operation}] ${message}`, { ...baseData, ...additionalData });
    }
  };
}

/**
 * Validates that a logging statement doesn't contain PII
 * This is used for static analysis and development-time checks
 * 
 * @param message - Log message to validate
 * @param data - Optional data to validate
 * @returns true if no PII detected, false otherwise
 */
export function validateLogSafety(message: string, data?: any): boolean {
  // Check message for PII patterns
  const messageLower = message.toLowerCase();
  for (const field of PII_FIELDS) {
    if (messageLower.includes(field.toLowerCase())) {
      return false;
    }
  }
  
  // Check data for PII fields
  if (data && typeof data === 'object') {
    for (const field of PII_FIELDS) {
      if (field in data) {
        return false;
      }
    }
  }
  
  return true;
}
