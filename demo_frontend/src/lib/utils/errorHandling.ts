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
  const errorMessage = toErrorWithMessage(error).message;

  if (
    errorMessage.includes("NetworkError when attempting to fetch") ||
    errorMessage.includes("Failed to fetch") ||
    errorMessage.includes("fetch failed") ||
    errorMessage.includes("ERR_CONNECTION_REFUSED") ||
    errorMessage.includes("ERR_NETWORK")
  ) {
    return "Unable to connect to the server. Please check your internet connection or try again later.";
  }

  if (
    errorMessage.includes("ERR_CONNECTION_TIMED_OUT") ||
    errorMessage.includes("timeout")
  ) {
    return "Connection timed out. Please try again.";
  }

  if (
    errorMessage.includes("ERR_NAME_NOT_RESOLVED") ||
    errorMessage.includes("getaddrinfo ENOTFOUND")
  ) {
    return "Server not found. Please check your internet connection.";
  }

  return errorMessage;
}

export type { ErrorWithMessage, ApiError };
