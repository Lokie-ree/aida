import { toast } from "sonner";

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  spaceId?: string;
  additionalData?: Record<string, any>;
}

export class AidaError extends Error {
  public readonly code: string;
  public readonly context: ErrorContext;
  public readonly userMessage: string;
  public readonly isRetryable: boolean;

  constructor(
    message: string,
    code: string,
    userMessage: string,
    context: ErrorContext = {},
    isRetryable: boolean = false
  ) {
    super(message);
    this.name = "AidaError";
    this.code = code;
    this.context = context;
    this.userMessage = userMessage;
    this.isRetryable = isRetryable;
  }
}

export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: "AUTH_REQUIRED",
  AUTH_INVALID: "AUTH_INVALID",
  AUTH_EXPIRED: "AUTH_EXPIRED",
  
  // Space errors
  SPACE_NOT_FOUND: "SPACE_NOT_FOUND",
  SPACE_ACCESS_DENIED: "SPACE_ACCESS_DENIED",
  SPACE_CREATE_FAILED: "SPACE_CREATE_FAILED",
  SPACE_UPDATE_FAILED: "SPACE_UPDATE_FAILED",
  
  // Document errors
  DOCUMENT_UPLOAD_FAILED: "DOCUMENT_UPLOAD_FAILED",
  DOCUMENT_PROCESSING_FAILED: "DOCUMENT_PROCESSING_FAILED",
  DOCUMENT_NOT_FOUND: "DOCUMENT_NOT_FOUND",
  
  // Voice errors
  VOICE_CONNECTION_FAILED: "VOICE_CONNECTION_FAILED",
  VOICE_PROCESSING_FAILED: "VOICE_PROCESSING_FAILED",
  VOICE_CONFIG_MISSING: "VOICE_CONFIG_MISSING",
  
  // RAG errors
  RAG_SEARCH_FAILED: "RAG_SEARCH_FAILED",
  RAG_GENERATION_FAILED: "RAG_GENERATION_FAILED",
  
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",
  
  // Generic errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
} as const;

export const ErrorMessages = {
  [ErrorCodes.AUTH_REQUIRED]: "Please sign in to continue",
  [ErrorCodes.AUTH_INVALID]: "Your session has expired. Please sign in again",
  [ErrorCodes.AUTH_EXPIRED]: "Your session has expired. Please sign in again",
  
  [ErrorCodes.SPACE_NOT_FOUND]: "This workspace could not be found",
  [ErrorCodes.SPACE_ACCESS_DENIED]: "You don't have permission to access this workspace",
  [ErrorCodes.SPACE_CREATE_FAILED]: "Failed to create workspace. Please try again",
  [ErrorCodes.SPACE_UPDATE_FAILED]: "Failed to update workspace. Please try again",
  
  [ErrorCodes.DOCUMENT_UPLOAD_FAILED]: "Failed to upload document. Please check the file and try again",
  [ErrorCodes.DOCUMENT_PROCESSING_FAILED]: "Failed to process document. Please try again",
  [ErrorCodes.DOCUMENT_NOT_FOUND]: "Document not found",
  
  [ErrorCodes.VOICE_CONNECTION_FAILED]: "Voice connection failed. Please check your microphone and try again",
  [ErrorCodes.VOICE_PROCESSING_FAILED]: "Failed to process voice input. Please try again",
  [ErrorCodes.VOICE_CONFIG_MISSING]: "Voice features are not configured. Please contact your administrator",
  
  [ErrorCodes.RAG_SEARCH_FAILED]: "Search failed. Please try again",
  [ErrorCodes.RAG_GENERATION_FAILED]: "Failed to generate response. Please try again",
  
  [ErrorCodes.NETWORK_ERROR]: "Network error. Please check your connection and try again",
  [ErrorCodes.TIMEOUT_ERROR]: "Request timed out. Please try again",
  
  [ErrorCodes.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again",
  [ErrorCodes.VALIDATION_ERROR]: "Please check your input and try again",
} as const;

export function handleError(error: unknown, context: ErrorContext = {}): AidaError {
  console.error("Error in", context.component, ":", error);

  // If it's already an AidaError, return it
  if (error instanceof AidaError) {
    return error;
  }

  // Handle different error types
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return new AidaError(
        error.message,
        ErrorCodes.NETWORK_ERROR,
        ErrorMessages[ErrorCodes.NETWORK_ERROR],
        context,
        true
      );
    }

    // Timeout errors
    if (error.message.includes("timeout") || error.message.includes("timed out")) {
      return new AidaError(
        error.message,
        ErrorCodes.TIMEOUT_ERROR,
        ErrorMessages[ErrorCodes.TIMEOUT_ERROR],
        context,
        true
      );
    }

    // Authentication errors
    if (error.message.includes("authentication") || error.message.includes("unauthorized")) {
      return new AidaError(
        error.message,
        ErrorCodes.AUTH_REQUIRED,
        ErrorMessages[ErrorCodes.AUTH_REQUIRED],
        context
      );
    }

    // Space errors
    if (error.message.includes("space") || error.message.includes("workspace")) {
      if (error.message.includes("not found")) {
        return new AidaError(
          error.message,
          ErrorCodes.SPACE_NOT_FOUND,
          ErrorMessages[ErrorCodes.SPACE_NOT_FOUND],
          context
        );
      }
      if (error.message.includes("permission") || error.message.includes("access")) {
        return new AidaError(
          error.message,
          ErrorCodes.SPACE_ACCESS_DENIED,
          ErrorMessages[ErrorCodes.SPACE_ACCESS_DENIED],
          context
        );
      }
    }

    // Document errors
    if (error.message.includes("document") || error.message.includes("upload")) {
      return new AidaError(
        error.message,
        ErrorCodes.DOCUMENT_UPLOAD_FAILED,
        ErrorMessages[ErrorCodes.DOCUMENT_UPLOAD_FAILED],
        context,
        true
      );
    }

    // Voice errors
    if (error.message.includes("voice") || error.message.includes("microphone")) {
      return new AidaError(
        error.message,
        ErrorCodes.VOICE_CONNECTION_FAILED,
        ErrorMessages[ErrorCodes.VOICE_CONNECTION_FAILED],
        context,
        true
      );
    }

    // RAG errors
    if (error.message.includes("RAG") || error.message.includes("search")) {
      return new AidaError(
        error.message,
        ErrorCodes.RAG_SEARCH_FAILED,
        ErrorMessages[ErrorCodes.RAG_SEARCH_FAILED],
        context,
        true
      );
    }

    // Generic error
    return new AidaError(
      error.message,
      ErrorCodes.UNKNOWN_ERROR,
      ErrorMessages[ErrorCodes.UNKNOWN_ERROR],
      context,
      true
    );
  }

  // Unknown error type
  return new AidaError(
    "Unknown error occurred",
    ErrorCodes.UNKNOWN_ERROR,
    ErrorMessages[ErrorCodes.UNKNOWN_ERROR],
    context,
    true
  );
}

export function showErrorToast(error: AidaError, options?: { duration?: number }) {
  const { duration = 5000 } = options || {};
  
  toast.error(error.userMessage, {
    description: error.isRetryable ? "You can try again" : undefined,
    duration,
    action: error.isRetryable ? {
      label: "Retry",
      onClick: () => {
        // This would need to be handled by the calling component
        console.log("Retry requested for error:", error.code);
      }
    } : undefined,
  });
}

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 3000,
  });
}

export function showInfoToast(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 4000,
  });
}

export function showWarningToast(message: string, description?: string) {
  toast.warning(message, {
    description,
    duration: 4000,
  });
}

// Error boundary helper
export function getErrorBoundaryFallback(error: AidaError) {
  return {
    title: "Something went wrong",
    message: error.userMessage,
    action: error.isRetryable ? "Try again" : "Go back",
    code: error.code,
  };
}

// Retry helper
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError!;
}
