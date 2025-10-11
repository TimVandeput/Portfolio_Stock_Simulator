/**
 * @fileoverview API Response and HTTP Client Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Standard API error response structure for handling server-side errors.
 *
 * Provides a consistent format for error responses across all API endpoints,
 * supporting both general error messages and field-specific validation errors.
 * Used by the HTTP client to parse and display user-friendly error messages.
 *
 * @interface ErrorResponse
 * @property {string} [message] - General error message describing the failure
 * @property {string} [error] - Alternative error field for different API formats
 * @property {string} [field] - Dynamic field-specific error messages for validation failures
 *
 * @example
 * ```typescript
 * // General API error
 * const generalError: ErrorResponse = {
 *   message: "Internal server error occurred"
 * };
 *
 * // Validation error with field-specific messages
 * const validationError: ErrorResponse = {
 *   message: "Validation failed",
 *   username: "Username is required",
 *   email: "Email format is invalid"
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Error handling in API client
 * async function handleApiError(response: Response): Promise<never> {
 *   const errorData: ErrorResponse = await response.json();
 *
 *   if (errorData.message) {
 *     throw new ApiError(errorData.message, response.status);
 *   }
 *
 *   // Handle field-specific errors
 *   const fieldErrors = Object.entries(errorData)
 *     .filter(([key]) => key !== 'message' && key !== 'error')
 *     .map(([field, message]) => `${field}: ${message}`)
 *     .join(', ');
 *
 *   throw new ApiError(fieldErrors || 'Unknown error occurred', response.status);
 * }
 * ```
 */
export interface ErrorResponse {
  message?: string;
  error?: string;
  [field: string]: string | undefined;
}

/**
 * Configuration options for the HTTP client instance.
 *
 * Defines customizable settings for HTTP client initialization, allowing
 * different base URLs for different environments or API versions.
 * Used during HTTP client instantiation to configure request defaults.
 *
 * @interface HttpClientOptions
 * @property {string} [baseUrl] - Base URL for all HTTP requests, defaults to environment config
 *
 * @example
 * ```typescript
 * // Production HTTP client
 * const prodClient = new HttpClient({
 *   baseUrl: 'https://api.stocksimulator.com'
 * });
 *
 * // Development HTTP client
 * const devClient = new HttpClient({
 *   baseUrl: 'http://localhost:8080'
 * });
 * ```
 *
 * @example
 * ```typescript
 * // Environment-specific client configuration
 * const clientOptions: HttpClientOptions = {
 *   baseUrl: process.env.NODE_ENV === 'production'
 *     ? 'https://api.stocksimulator.com'
 *     : 'http://localhost:8080'
 * };
 *
 * const apiClient = new HttpClient(clientOptions);
 * ```
 */
export interface HttpClientOptions {
  baseUrl?: string;
}
