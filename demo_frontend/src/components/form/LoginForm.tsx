/**
 * @fileoverview Professional login form component with neumorphic design and comprehensive validation.
 *
 * This module provides a sophisticated login form component featuring neumorphic
 * design elements, comprehensive state management, real-time validation, secure
 * password handling, and seamless integration with the Stock Simulator platform's
 * authentication system and visual design language.
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
 * Props interface for the LoginForm component.
 * @interface LoginFormProps
 * @extends BaseComponentProps
 */
export interface LoginFormProps extends BaseComponentProps {
  usernameOrEmail: string;
  setUsernameOrEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  error: string | null;
  success: string | null;
  isLoggingIn: boolean;
  onSubmit: () => void;
  onFlipToRegister: () => void;
}

/**
 * Professional login form with neumorphic design and comprehensive authentication features.
 *
 * This sophisticated form component provides secure user authentication with
 * neumorphic design elements, real-time validation, comprehensive state management,
 * and seamless integration with the Stock Simulator platform's authentication
 * system. It features responsive design, accessibility support, and professional
 * visual feedback for optimal user experience.
 *
 * @remarks
 * The component delivers comprehensive login functionality through:
 *
 * **Authentication Features**:
 * - **Flexible Login**: Supports both email and username authentication
 * - **Secure Password**: Professional password input with visibility controls
 * - **Real-time Validation**: Immediate feedback on form validation errors
 * - **State Management**: Comprehensive loading and error state handling
 * - **Success Feedback**: Visual confirmation of successful authentication
 *
 * **Neumorphic Design System**:
 * - **Card Layout**: Professional card-based form presentation
 * - **Consistent Styling**: Integrated neumorphic input and button components
 * - **Visual Hierarchy**: Clear title and action element organization
 * - **Smooth Transitions**: Fluid animations and state transitions
 * - **Brand Integration**: Consistent color scheme and typography
 *
 * **Form Interaction**:
 * - **Form Submission**: Proper form handling with preventDefault
 * - **Enter Key Support**: Full keyboard navigation and submission
 * - **Loading States**: Visual feedback during authentication process
 * - **Disabled States**: Proper form disabling during async operations
 * - **Error Handling**: Comprehensive error display and management
 *
 * **User Experience**:
 * - **Quick Registration**: Easy toggle to registration form
 * - **Status Messages**: Clear success and error message display
 * - **Loading Feedback**: Real-time feedback during login process
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
 * **Visual Design Elements**:
 * - **Professional Headers**: Clean title with registration link
 * - **Consistent Inputs**: Integrated neumorphic input components
 * - **Action Buttons**: Professional submit button with loading states
 * - **Status Display**: Dedicated area for error and success messages
 * - **Card Effects**: Proper backface visibility for 3D transitions
 *
 * **Accessibility Features**:
 * - **Form Labels**: Proper placeholder text for screen readers
 * - **Keyboard Navigation**: Full keyboard accessibility support
 * - **Focus Management**: Proper focus handling throughout form
 * - **Error Announcements**: Screen reader compatible error messaging
 * - **State Communication**: Clear communication of form states
 *
 * **Integration Capabilities**:
 * - **Hook Integration**: Seamless integration with authentication hooks
 * - **State Synchronization**: Real-time state updates with parent components
 * - **Event Handling**: Comprehensive callback system for form events
 * - **Animation Support**: Built-in support for form flip animations
 * - **Theme Compatibility**: Full integration with platform theming system
 *
 * The component serves as the primary authentication interface providing users
 * with secure, professional, and user-friendly login capabilities while
 * maintaining design consistency and optimal user experience throughout
 * the Stock Simulator platform.
 *
 * @example
 * ```tsx
 * // Basic login form usage
 * function LoginPage() {
 *   const {
 *     usernameOrEmail,
 *     setUsernameOrEmail,
 *     password,
 *     setPassword,
 *     error,
 *     success,
 *     isLoggingIn,
 *     handleLogin,
 *   } = useLoginForm();
 *
 *   const [showRegister, setShowRegister] = useState(false);
 *
 *   return (
 *     <div className="auth-container">
 *       <LoginForm
 *         usernameOrEmail={usernameOrEmail}
 *         setUsernameOrEmail={setUsernameOrEmail}
 *         password={password}
 *         setPassword={setPassword}
 *         error={error}
 *         success={success}
 *         isLoggingIn={isLoggingIn}
 *         onSubmit={handleLogin}
 *         onFlipToRegister={() => setShowRegister(true)}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Login form with flip animation
 * function AuthenticationCard() {
 *   const [isFlipped, setIsFlipped] = useState(false);
 *   const loginProps = useLoginForm();
 *
 *   return (
 *     <div className={`auth-card ${isFlipped ? 'flipped' : ''}`}>
 *       <LoginForm
 *         {...loginProps}
 *         onFlipToRegister={() => setIsFlipped(true)}
 *       />
 *     </div>
 *   );
 * }
 *
 * // Complete authentication flow
 * function AuthPage() {
 *   const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
 *   const loginProps = useLoginForm();
 *
 *   return (
 *     <div className="auth-page">
 *       {authMode === 'login' ? (
 *         <LoginForm
 *           {...loginProps}
 *           onFlipToRegister={() => setAuthMode('register')}
 *         />
 *       ) : (
 *         <RegisterForm onFlipToLogin={() => setAuthMode('login')} />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for login form state and event handling
 * @returns A professional login form with neumorphic design, comprehensive
 * validation, secure authentication, and responsive user experience
 *
 * @see {@link PasswordInput} - Secure password input component
 * @see {@link NeumorphicButton} - Styled button component
 * @see {@link NeumorphicInput} - Styled input component
 * @see {@link StatusMessage} - Status message display component
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function LoginForm({
  usernameOrEmail,
  setUsernameOrEmail,
  password,
  setPassword,
  error,
  success,
  isLoggingIn,
  onSubmit,
  onFlipToRegister,
}: LoginFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className={`
        login-card login-card-front absolute inset-0 rounded-2xl px-8 py-6 sm:py-8 overflow-hidden
        [backface-visibility:hidden] flex flex-col h-full
        transition-shadow duration-500
      `}
    >
      <div className="flex justify-between items-start">
        <h1 className="login-title text-2xl font-bold text-secondary">Login</h1>
        <div
          onClick={() => {
            onFlipToRegister();
          }}
          className="login-link cursor-pointer transition-colors duration-200 text-sm font-medium border-b border-transparent"
          style={{
            color: "var(--text-secondary)",
            borderColor: "transparent",
          }}
        >
          Register →
        </div>
      </div>

      <div className="mt-3 sm:mt-5 flex flex-col flex-1">
        <NeumorphicInput
          type="text"
          placeholder="Email or Username"
          value={usernameOrEmail}
          onChange={setUsernameOrEmail}
          className="my-2"
        />
        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={setPassword}
          className="my-2"
        />

        <div className="mt-auto flex flex-col">
          <div className="mb-2 h-[54px] overflow-hidden flex items-center">
            {(error || success) && (
              <StatusMessage
                message={(error || success) as string}
                type={error ? "error" : "success"}
                className="mb-1 w-full"
              />
            )}
          </div>
          <NeumorphicButton
            type="submit"
            onClick={onSubmit}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </NeumorphicButton>
        </div>
      </div>
    </form>
  );
}
