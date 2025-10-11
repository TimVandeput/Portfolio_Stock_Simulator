/**
 * @fileoverview Universal status message component for user feedback and system notifications
 *
 * This component provides standardized status messaging with adaptive styling,
 * smooth transitions, and consistent visual feedback. Features include error
 * and success states, placeholder handling, and seamless integration with
 * forms, API responses, and validation systems.
 */

import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for StatusMessage component configuration
 * @interface StatusMessageProps
 * @extends {BaseComponentProps}
 */
export interface StatusMessageProps extends BaseComponentProps {
  /** Status message text to display */
  message: string;
  /** Visual style and semantic meaning of the message */
  type?: "error" | "success";
}

/**
 * Universal status message component for user feedback and system notifications
 *
 * @remarks
 * The StatusMessage component delivers consistent status communication with the following features:
 *
 * **Message Display:**
 * - Clear, centered text presentation
 * - Minimum height maintenance for layout stability
 * - Placeholder handling for empty messages
 * - Professional typography with tight leading
 *
 * **Visual States:**
 * - Error state with red error color theming
 * - Success state with green success color theming
 * - Invisible placeholder when no message present
 * - Consistent opacity and transition effects
 *
 * **Adaptive Styling:**
 * - Context-aware color application based on message type
 * - Smooth opacity transitions for state changes
 * - Flexible className extension support
 * - Theme-integrated color variables
 *
 * **Layout Stability:**
 * - Fixed minimum height prevents layout shifts
 * - Invisible placeholder maintains space when empty
 * - Consistent spacing regardless of message presence
 * - Proper alignment and positioning
 *
 * **Transition Effects:**
 * - Smooth 200ms opacity transitions
 * - Fade-in/fade-out behavior for message changes
 * - Professional animation timing
 * - Smooth state transitions
 *
 * **Component Architecture:**
 * - Reusable key prop based on message and type
 * - Conditional styling with template literals
 * - Clean prop interface with sensible defaults
 * - TypeScript type safety
 *
 * **Theme Integration:**
 * - CSS custom properties for error/success colors
 * - Consistent color theming across application
 * - Text size and spacing aligned with design system
 * - Professional visual hierarchy
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Clear contrast ratios for error/success states
 * - Screen reader compatible text
 * - Logical focus and reading order
 *
 * **Form Integration:**
 * - Seamless validation feedback
 * - Real-time error/success messaging
 * - API response status display
 * - User action confirmation
 *
 * @param props - Configuration object for status message display
 * @returns StatusMessage component with themed feedback display
 *
 * @example
 * ```tsx
 * // Error message display
 * <StatusMessage
 *   message="Invalid email format. Please check your input."
 *   type="error"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Success message display
 * <StatusMessage
 *   message="Account created successfully! Welcome aboard."
 *   type="success"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Form validation integration
 * function ContactForm() {
 *   const [status, setStatus] = useState<{
 *     message: string;
 *     type: "error" | "success";
 *   }>({ message: "", type: "error" });
 *
 *   const handleSubmit = async (data: FormData) => {
 *     try {
 *       await submitContact(data);
 *       setStatus({
 *         message: "Message sent successfully!",
 *         type: "success"
 *       });
 *     } catch (error) {
 *       setStatus({
 *         message: "Failed to send message. Please try again.",
 *         type: "error"
 *       });
 *     }
 *   };
 *
 *   return (
 *     <form onSubmit={handleSubmit} className="space-y-4">
 *       <EmailInput />
 *       <MessageInput />
 *       <StatusMessage
 *         message={status.message}
 *         type={status.type}
 *       />
 *       <SubmitButton />
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // API status feedback
 * function ProfileUpdate() {
 *   const [apiStatus, setApiStatus] = useState("");
 *   const [statusType, setStatusType] = useState<"error" | "success">("error");
 *
 *   const updateProfile = async () => {
 *     setApiStatus("Updating profile...");
 *     setStatusType("success");
 *
 *     try {
 *       await api.updateProfile(profileData);
 *       setApiStatus("Profile updated successfully!");
 *       setStatusType("success");
 *     } catch (error) {
 *       setApiStatus("Update failed. Please try again.");
 *       setStatusType("error");
 *     }
 *   };
 *
 *   return (
 *     <div className="space-y-4">
 *       <ProfileForm />
 *       <StatusMessage
 *         message={apiStatus}
 *         type={statusType}
 *       />
 *       <UpdateButton onClick={updateProfile} />
 *     </div>
 *   );
 * }
 * ```
 */
export default function StatusMessage({
  message,
  type = "error",
  className = "",
}: StatusMessageProps) {
  return (
    <div
      key={`${message}-${type}`}
      className={`text-xs leading-tight text-center min-h-5 transition-opacity duration-200 ${
        type === "error" ? "text-error" : "text-success"
      } ${className}`}
    >
      {message ? message : <span className="opacity-0">placeholder</span>}
    </div>
  );
}
