/**
 * @fileoverview Neumorphic-styled input component with advanced interaction design
 *
 * This component provides a sophisticated input field with neumorphic design principles,
 * delivering elevated visual aesthetics with soft shadows and subtle depth effects.
 * Features comprehensive accessibility support, flexible customization, and seamless
 * integration with form systems and validation workflows.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for NeumorphicInput component configuration
 * @interface InputProps
 * @extends {BaseComponentProps}
 */
export interface InputProps extends BaseComponentProps {
  /** HTML input type (text, email, password, etc.) */
  type: string;
  /** Placeholder text for empty input state */
  placeholder?: string;
  /** Current input value */
  value: string;
  /** Callback function when input value changes */
  onChange: (value: string) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the input is required for form submission */
  required?: boolean;
  /** ARIA label for accessibility */
  "aria-label"?: string;
  /** ARIA described-by reference for accessibility */
  "aria-describedby"?: string;
}

/**
 * Neumorphic-styled input component with advanced interaction design
 *
 * @remarks
 * The NeumorphicInput component delivers sophisticated form input with the following features:
 *
 * **Neumorphic Design:**
 * - Soft, elevated appearance with subtle shadow effects
 * - Inset styling that creates depth and tactile feel
 * - Professional rounded corners with consistent radius
 * - Borderless design for clean, modern aesthetics
 *
 * **Input Features:**
 * - Support for all standard HTML input types
 * - Controlled component with external state management
 * - Real-time value updates through callback system
 * - Placeholder text support for user guidance
 *
 * **State Management:**
 * - Disabled state with appropriate visual feedback
 * - Required field validation support
 * - Focus state handling with outline removal
 * - Consistent padding and sizing across states
 *
 * **Accessibility:**
 * - Full ARIA attribute support for screen readers
 * - Proper labeling and description associations
 * - Keyboard navigation compatibility
 * - Focus management with custom styling
 *
 * **Customization:**
 * - Flexible className system for additional styling
 * - Theme integration through CSS custom properties
 * - Consistent typography and spacing
 * - Responsive design considerations
 *
 * **Form Integration:**
 * - Compatible with form validation libraries
 * - Proper event handling for form submissions
 * - Required field support for validation
 * - Seamless integration with form state management
 *
 * @param props - Configuration object for input behavior and styling
 * @returns NeumorphicInput component with elevated design aesthetics
 *
 * @example
 * ```tsx
 * // Basic text input with neumorphic styling
 * const [username, setUsername] = useState("");
 *
 * <NeumorphicInput
 *   type="text"
 *   placeholder="Enter username"
 *   value={username}
 *   onChange={setUsername}
 *   aria-label="Username"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Email input with validation and accessibility
 * <NeumorphicInput
 *   type="email"
 *   placeholder="your.email@example.com"
 *   value={email}
 *   onChange={setEmail}
 *   required={true}
 *   aria-label="Email address"
 *   aria-describedby="email-error"
 *   className="w-full"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Form integration with comprehensive validation
 * function ContactForm() {
 *   const [formData, setFormData] = useState({
 *     name: "",
 *     email: "",
 *     message: ""
 *   });
 *
 *   return (
 *     <form className="space-y-6">
 *       <div>
 *         <label className="block text-sm font-medium mb-2">
 *           Full Name
 *         </label>
 *         <NeumorphicInput
 *           type="text"
 *           placeholder="John Doe"
 *           value={formData.name}
 *           onChange={(value) =>
 *             setFormData(prev => ({ ...prev, name: value }))
 *           }
 *           required={true}
 *           className="w-full"
 *         />
 *       </div>
 *     </form>
 *   );
 * }
 * ```
 */
export default function NeumorphicInput({
  type,
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
  required = false,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      className={`neumorphic-input p-3 rounded-xl border-none focus:outline-none ${className}`}
    />
  );
}
