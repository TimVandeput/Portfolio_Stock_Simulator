export function getErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  // Map common network errors to user-friendly messages
  if (
    message.includes("NetworkError when attempting to fetch") ||
    message.includes("Failed to fetch") ||
    message.includes("fetch failed") ||
    message.includes("ERR_CONNECTION_REFUSED") ||
    message.includes("ERR_NETWORK")
  ) {
    return "Unable to connect to the server. Please check your internet connection or try again later.";
  }

  if (
    message.includes("ERR_CONNECTION_TIMED_OUT") ||
    message.includes("timeout")
  ) {
    return "Connection timed out. Please try again.";
  }

  if (
    message.includes("ERR_NAME_NOT_RESOLVED") ||
    message.includes("getaddrinfo ENOTFOUND")
  ) {
    return "Server not found. Please check your internet connection.";
  }

  return message;
}
