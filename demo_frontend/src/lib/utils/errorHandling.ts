interface ErrorWithMessage {
  message: string;
}

interface ApiError extends ErrorWithMessage {
  status?: number;
  details?: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    isErrorWithMessage(error) && typeof error === "object" && "status" in error
  );
}

export type { ErrorWithMessage, ApiError };
