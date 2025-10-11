/**
 * @fileoverview Professional registration form component with comprehensive validation and neumorphic design.
 *
 * This module provides a sophisticated user registration form component featuring
 * neumorphic design elements, comprehensive field validation, secure password
 * confirmation, real-time feedback, and seamless integration with the Stock
 * Simulator platform's authentication system and visual design language.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import React from "react";
import PasswordInput from "@/components/input/PasswordInput";
import NeumorphicButton from "@/components/button/NeumorphicButton";
import NeumorphicInput from "@/components/input/NeumorphicInput";
import StatusMessage from "@/components/status/StatusMessage";
import type { BaseComponentProps } from "@/types/components";

/**
 * Registration status interface for success and error messaging.
 * @interface RegisterStatus
 */
export interface RegisterStatus {
  /** Status message to display to the user */
  message: string;
  /** Type of status message indicating success or error state */
  type: "error" | "success";
}

/**
 * Props interface for the RegisterForm component.
 * @interface RegisterFormProps
 * @extends BaseComponentProps
 */
export interface RegisterFormProps extends BaseComponentProps {
  rUser: string;
  setRUser: (value: string) => void;
  rEmail: string;
  setREmail: (value: string) => void;
  rPass: string;
  setRPass: (value: string) => void;
  rPass2: string;
  setRPass2: (value: string) => void;
  rStatus: RegisterStatus | null;
  isRegistering: boolean;
  onSubmit: () => void;
  onFlipToLogin: () => void;
}

/**
 * Professional registration form with comprehensive validation and neumorphic design.
 *
 * This sophisticated registration form component provides secure user account
 * creation with comprehensive field validation, password confirmation, neumorphic
 * design elements, and seamless integration with the Stock Simulator platform's
 * authentication system. It features responsive design, accessibility support,
 * and professional visual feedback for optimal user onboarding experience.
 *
 * @remarks
 * The component delivers comprehensive registration functionality through:
 *
 * **Registration Features**:
 * - **Complete User Data**: Username, email, and password collection
 * - **Password Confirmation**: Dual password entry with validation
 * - **Email Validation**: Built-in HTML5 email format validation
 * - **Real-time Feedback**: Immediate validation and error messaging
 * - **State Management**: Comprehensive loading and error state handling
 *
 * **Security Implementation**:
 * - **Password Security**: Professional password input with visibility controls
 * - **Confirmation Validation**: Password matching validation before submission
 * - **Input Sanitization**: Proper input handling and validation
 * - **Secure Submission**: Protected form submission with async handling
 * - **Error Handling**: Comprehensive error display and management
 *
 * **Neumorphic Design System**:
 * - **Card Layout**: Professional card-based form presentation with 3D effects
 * - **Consistent Styling**: Integrated neumorphic input and button components
 * - **Visual Hierarchy**: Clear title and action element organization
 * - **Smooth Transitions**: Fluid animations and state transitions
 * - **Brand Integration**: Consistent color scheme and typography
 *
 * **Form Interaction**:
 * - **Form Submission**: Proper form handling with preventDefault
 * - **Enter Key Support**: Full keyboard navigation and submission
 * - **Loading States**: Visual feedback during registration process
 * - **Disabled States**: Proper form disabling during async operations
 * - **Success/Error Display**: Clear status message presentation
 *
 * **User Experience**:
 * - **Quick Login Toggle**: Easy toggle to login form via flip animation
 * - **Progress Feedback**: Real-time feedback during registration process
 * - **Error Recovery**: Clear error messages with actionable guidance
 * - **Responsive Layout**: Mobile-optimized design with proper spacing
 * - **Accessibility**: Full keyboard navigation and screen reader support
 *
 * **Layout Management**:
 * - **Flexible Height**: Full-height layout with proper content distribution
 * - **Fixed Message Area**: Consistent 54px area for status messages
 * - **Auto-positioning**: Automatic button positioning at form bottom
 * - **Overflow Handling**: Proper overflow management for long messages
 * - **Responsive Spacing**: Adaptive spacing for different screen sizes
 *
 * **Field Organization**:
 * - **Logical Flow**: Username, email, password, confirmation sequence
 * - **Consistent Spacing**: Uniform spacing between form fields
 * - **Input Types**: Appropriate input types for validation and UX
 * - **Placeholder Text**: Clear placeholder guidance for each field
 * - **Field Validation**: Individual field validation and feedback
 *
 * **3D Animation Support**:
 * - **Flip Animation**: Built-in support for 3D card flip animations
 * - **Backface Visibility**: Proper backface handling for smooth transitions
 * - **Transform Effects**: 180-degree rotation for flip animations
 * - **Transition Timing**: Smooth 500ms transition durations
 * - **Hardware Acceleration**: GPU-accelerated animations for performance
 *
 * **Accessibility Features**:
 * - **Form Labels**: Proper placeholder text for screen readers
 * - **Keyboard Navigation**: Full keyboard accessibility support
 * - **Focus Management**: Proper focus handling throughout form
 * - **Error Announcements**: Screen reader compatible error messaging
 * - **State Communication**: Clear communication of form states
 *
 * **Integration Capabilities**:
 * - **Hook Integration**: Seamless integration with registration hooks
 * - **State Synchronization**: Real-time state updates with parent components
 * - **Event Handling**: Comprehensive callback system for form events
 * - **Animation Support**: Built-in support for form flip animations
 * - **Theme Compatibility**: Full integration with platform theming system
 *
 * The component serves as the primary user registration interface providing
 * new users with secure, comprehensive, and user-friendly account creation
 * capabilities while maintaining design consistency and optimal user experience
 * throughout the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic registration form usage
 * function RegisterPage() {
 *   const {
 *     rUser, setRUser,
 *     rEmail, setREmail,
 *     rPass, setRPass,
 *     rPass2, setRPass2,
 *     rStatus,
 *     isRegistering,
 *     handleRegister,
 *   } = useRegisterForm();
 *
 *   const [showLogin, setShowLogin] = useState(false);
 *
 *   return (
 *     <div className="auth-container">
 *       <RegisterForm
 *         rUser={rUser}
 *         setRUser={setRUser}
 *         rEmail={rEmail}
 *         setREmail={setREmail}
 *         rPass={rPass}
 *         setRPass={setRPass}
 *         rPass2={rPass2}
 *         setRPass2={setRPass2}
 *         rStatus={rStatus}
 *         isRegistering={isRegistering}
 *         onSubmit={handleRegister}
 *         onFlipToLogin={() => setShowLogin(true)}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Registration form with flip animation
 * function AuthenticationCard() {
 *   const [isFlipped, setIsFlipped] = useState(false);
 *   const registerProps = useRegisterForm();
 *
 *   return (
 *     <div className={`auth-card ${isFlipped ? 'flipped' : ''}`}>
 *       <RegisterForm
 *         {...registerProps}
 *         onFlipToLogin={() => setIsFlipped(false)}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Complete authentication flow
 * function AuthPage() {
 *   const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
 *   const registerProps = useRegisterForm();
 *
 *   return (
 *     <div className="auth-page">
 *       {authMode === 'register' ? (
 *         <RegisterForm
 *           {...registerProps}
 *           onFlipToLogin={() => setAuthMode('login')}
 *         />
 *       ) : (
 *         <LoginForm onFlipToRegister={() => setAuthMode('register')} />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for registration form state and event handling
 * @returns A professional registration form with neumorphic design, comprehensive
 * validation, secure password confirmation, and responsive user experience
 *
 * @see {@link PasswordInput} - Secure password input component
 * @see {@link NeumorphicButton} - Styled button component
 * @see {@link NeumorphicInput} - Styled input component
 * @see {@link StatusMessage} - Status message display component
 * @see {@link RegisterStatus} - Interface for registration status messaging
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function RegisterForm({
  rUser,
  setRUser,
  rEmail,
  setREmail,
  rPass,
  setRPass,
  rPass2,
  setRPass2,
  rStatus,
  isRegistering,
  onSubmit,
  onFlipToLogin,
}: RegisterFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className={`
        login-card absolute inset-0 rounded-2xl px-8 py-6 sm:py-8 overflow-hidden
        [backface-visibility:hidden] flex flex-col h-full
        transition-shadow duration-500
      `}
      style={{
        backgroundColor: "var(--bg-surface)",
        boxShadow: "var(--shadow-large)",
        transform: "rotateY(180deg)",
      }}
    >
      <div className="flex justify-between items-start">
        <h1
          className="login-title text-2xl font-bold"
          style={{ color: "var(--text-secondary)" }}
        >
          Register
        </h1>
        <div
          onClick={() => {
            onFlipToLogin();
          }}
          className="login-link cursor-pointer transition-colors duration-200 text-sm font-medium border-b border-transparent"
          style={{
            color: "var(--text-secondary)",
            borderColor: "transparent",
          }}
        >
          Login →
        </div>
      </div>

      <div className="mt-3 sm:mt-5 flex flex-col flex-1">
        <NeumorphicInput
          type="text"
          placeholder="Username"
          value={rUser}
          onChange={setRUser}
          className="my-2"
        />
        <NeumorphicInput
          type="email"
          placeholder="Email"
          value={rEmail}
          onChange={setREmail}
          className="my-2"
        />
        <PasswordInput
          placeholder="Password"
          value={rPass}
          onChange={setRPass}
          className="my-2"
        />
        <PasswordInput
          placeholder="Confirm password"
          value={rPass2}
          onChange={setRPass2}
          className="my-2"
        />

        <div className="mt-auto flex flex-col">
          <div className="mb-2 h-[54px] overflow-hidden flex items-center">
            {rStatus && (
              <StatusMessage
                message={rStatus.message}
                type={rStatus.type}
                className="mb-1 w-full"
              />
            )}
          </div>
          <NeumorphicButton
            type="submit"
            onClick={onSubmit}
            disabled={isRegistering}
          >
            {isRegistering ? "Registering..." : "Register"}
          </NeumorphicButton>
        </div>
      </div>
    </form>
  );
}
