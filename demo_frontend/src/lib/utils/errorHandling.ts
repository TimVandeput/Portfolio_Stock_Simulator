/**
 * @fileoverview Error Handling Utilities for Stock Simulator Application
 * @author Tim Vandeput
 * @since 1.0.0
 */

import { ApiError } from "@/lib/api/http";

/**
 * Extracts and formats user-friendly error messages from various error types.
 *
 * Provides centralized error message handling for the application, converting
 * technical errors, network issues, and API errors into readable user messages.
 * Handles multiple error types including custom ApiError, native Error objects,
 * network failures, and timeout scenarios.
 *
 * @param error - The error object of unknown type to process
 * @returns User-friendly error message string
 *
 * @remarks
 * This function provides:
 * - ApiError handling with structured error messages
 * - Network error detection and user-friendly messaging
 * - Connection timeout handling with retry suggestions
 * - DNS resolution error handling
 * - Fallback for unknown error types
 * - Consistent error messaging across the application
 *
 * Error handling hierarchy:
 * 1. Custom ApiError objects (from API responses)
 * 2. Network connectivity issues (offline, connection refused)
 * 3. Timeout errors (connection timeouts, request timeouts)
 * 4. DNS resolution failures (server not found)
 * 5. Generic Error objects and fallback string conversion
 *
 * Network error patterns detected:
 * - "NetworkError when attempting to fetch" - General network failure
 * - "Failed to fetch" - Fetch API network error
 * - "fetch failed" - Node.js fetch failure
 * - "ERR_CONNECTION_REFUSED" - Server refused connection
 * - "ERR_NETWORK" - General network error
 * - "ERR_CONNECTION_TIMED_OUT" - Connection timeout
 * - "timeout" - General timeout error
 * - "ERR_NAME_NOT_RESOLVED" - DNS resolution failure
 * - "getaddrinfo ENOTFOUND" - DNS lookup failure
 *
 * @example
 * ```typescript
 * // API error handling
 * try {
 *   const response = await fetchUserData(userId);
 *   setUserData(response);
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   console.error('User data fetch failed:', message);
 *   setErrorMessage(message);
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component error handling
 * function DataComponent() {
 *   const [data, setData] = useState(null);
 *   const [error, setError] = useState<string | null>(null);
 *   const [loading, setLoading] = useState(false);
 *
 *   const loadData = async () => {
 *     try {
 *       setLoading(true);
 *       setError(null);
 *
 *       const result = await apiClient.getData();
 *       setData(result);
 *     } catch (err) {
 *       const errorMessage = getErrorMessage(err);
 *       setError(errorMessage);
 *
 *       // Optional: Log technical details for debugging
 *       console.error('Data loading error:', err);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *
 *   if (error) {
 *     return <ErrorMessage message={error} onRetry={loadData} />;
 *   }
 *
 *   return <DataDisplay data={data} loading={loading} />;
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Global error handler with categorization
 * function handleGlobalError(error: unknown, context: string) {
 *   const userMessage = getErrorMessage(error);
 *
 *   // Categorize error for different handling
 *   if (userMessage.includes('internet connection')) {
 *     // Network error - show offline indicator
 *     showNetworkError(userMessage);
 *     trackEvent('error.network', { context });
 *   } else if (userMessage.includes('timed out')) {
 *     // Timeout error - suggest retry
 *     showTimeoutError(userMessage);
 *     trackEvent('error.timeout', { context });
 *   } else if (error instanceof ApiError) {
 *     // API error - handle based on status code
 *     handleApiError(error, userMessage);
 *     trackEvent('error.api', { context, status: error.status });
 *   } else {
 *     // Generic error
 *     showGenericError(userMessage);
 *     trackEvent('error.generic', { context, message: userMessage });
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Form submission with error handling
 * async function handleFormSubmit(formData: FormData) {
 *   try {
 *     setSubmitting(true);
 *     setSubmitError(null);
 *
 *     await submitForm(formData);
 *
 *     showSuccessMessage('Form submitted successfully!');
 *     resetForm();
 *   } catch (error) {
 *     const errorMessage = getErrorMessage(error);
 *     setSubmitError(errorMessage);
 *
 *     // Focus first error field if validation error
 *     if (error instanceof ApiError && error.status === 400) {
 *       focusFirstErrorField();
 *     }
 *   } finally {
 *     setSubmitting(false);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Error boundary integration
 * class ErrorBoundary extends React.Component {
 *   constructor(props) {
 *     super(props);
 *     this.state = { hasError: false, errorMessage: null };
 *   }
 *
 *   static getDerivedStateFromError(error) {
 *     const userMessage = getErrorMessage(error);
 *     return {
 *       hasError: true,
 *       errorMessage: userMessage
 *     };
 *   }
 *
 *   componentDidCatch(error, errorInfo) {
 *     const userMessage = getErrorMessage(error);
 *
 *     // Log to monitoring service
 *     console.error('Error boundary caught error:', {
 *       error,
 *       errorInfo,
 *       userMessage
 *     });
 *   }
 *
 *   render() {
 *     if (this.state.hasError) {
 *       return <ErrorFallback message={this.state.errorMessage} />;
 *     }
 *
 *     return this.props.children;
 *   }
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }

  const message = error instanceof Error ? error.message : String(error);

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
