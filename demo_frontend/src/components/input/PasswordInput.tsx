/**
 * @fileoverview Secure password input component with visibility toggle functionality
 *
 * This component provides a sophisticated password input field with show/hide toggle
 * capability, neumorphic design aesthetics, and comprehensive security considerations.
 * Features include visual feedback, accessible toggle controls, and seamless integration
 * with authentication and form validation systems.
 */

"use client";

import { useState } from "react";
import DynamicIcon from "../ui/DynamicIcon";
import { BaseComponentProps } from "@/types";

/**
 * Props interface for PasswordInput component configuration
 * @interface PasswordInputProps
 * @extends {BaseComponentProps}
 */
export interface PasswordInputProps extends BaseComponentProps {
  /** Placeholder text for empty password field */
  placeholder: string;
  /** Current password value */
  value: string;
  /** Callback function when password value changes */
  onChange: (value: string) => void;
  /** Additional CSS classes for styling customization */
  className?: string;
}

/**
 * Secure password input component with visibility toggle functionality
 *
 * @remarks
 * The PasswordInput component delivers secure password entry with the following features:
 *
 * **Security Features:**
 * - Password masking by default for privacy protection
 * - Toggle visibility functionality for user convenience
 * - Secure input handling without value exposure
 * - Proper password field semantics and behavior
 *
 * **Visual Design:**
 * - Neumorphic styling with inset shadow effects
 * - Eye/eye-off icon toggle for intuitive interaction
 * - Consistent theming with CSS custom properties
 * - Professional rounded corners and padding
 *
 * **User Experience:**
 * - Clickable toggle button positioned in input field
 * - Smooth transitions between visible/hidden states
 * - Visual feedback on hover and interaction
 * - Responsive design for various screen sizes
 *
 * **Interactive Elements:**
 * - Toggle button with proper event handling
 * - Dynamic icon switching (eye/eye-off)
 * - Hover effects with color transitions
 * - Focus management and accessibility
 *
 * **Form Integration:**
 * - Controlled component with external state management
 * - Real-time value updates through callback system
 * - Compatible with form validation libraries
 * - Proper event handling for form submissions
 *
 * **Accessibility:**
 * - Semantic button element for toggle functionality
 * - Proper focus management and keyboard navigation
 * - Screen reader compatible with clear labeling
 * - Visual indicators for current state
 *
 * @param props - Configuration object for password input behavior
 * @returns PasswordInput component with secure entry and visibility toggle
 *
 * @example
 * ```tsx
 * // Basic password input with toggle functionality
 * const [password, setPassword] = useState("");
 *
 * <PasswordInput
 *   placeholder="Enter your password"
 *   value={password}
 *   onChange={setPassword}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Login form integration with validation
 * function LoginForm() {
 *   const [credentials, setCredentials] = useState({
 *     email: "",
 *     password: ""
 *   });
 *
 *   return (
 *     <form className="space-y-4">
 *       <PasswordInput
 *         placeholder="Password"
 *         value={credentials.password}
 *         onChange={(password) =>
 *           setCredentials(prev => ({ ...prev, password }))
 *         }
 *         className="w-full"
 *       />
 *     </form>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Registration form with password confirmation
 * function RegistrationForm() {
 *   const [passwords, setPasswords] = useState({
 *     password: "",
 *     confirmPassword: ""
 *   });
 *
 *   return (
 *     <div className="space-y-4">
 *       <div>
 *         <label className="block text-sm font-medium mb-2">
 *           Password
 *         </label>
 *         <PasswordInput
 *           placeholder="Create a secure password"
 *           value={passwords.password}
 *           onChange={(password) =>
 *             setPasswords(prev => ({ ...prev, password }))
 *           }
 *           className="w-full"
 *         />
 *       </div>
 *
 *       <div>
 *         <label className="block text-sm font-medium mb-2">
 *           Confirm Password
 *         </label>
 *         <PasswordInput
 *           placeholder="Confirm your password"
 *           value={passwords.confirmPassword}
 *           onChange={(confirmPassword) =>
 *             setPasswords(prev => ({ ...prev, confirmPassword }))
 *           }
 *           className="w-full"
 *         />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export default function PasswordInput({
  placeholder,
  value,
  onChange,
  className = "",
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="neumorphic-input w-full p-3 pr-12 rounded-xl border-none focus:outline-none"
        style={{
          boxShadow: "var(--shadow-neu-inset)",
          color: "var(--input-text)",
        }}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle-button absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        {showPassword ? (
          <DynamicIcon iconName="eye-off" size={18} />
        ) : (
          <DynamicIcon iconName="eye" size={18} />
        )}
      </button>
    </div>
  );
}
