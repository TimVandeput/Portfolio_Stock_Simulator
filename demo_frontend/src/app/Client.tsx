/**
 * @fileoverview Client-side authentication interface for the Stock Simulator.
 *
 * This module provides the interactive authentication experience, featuring
 * animated login and registration forms with comprehensive form validation,
 * error handling, and smooth transitions between authentication states.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/form/LoginForm";
import RegisterForm from "@/components/form/RegisterForm";
import Loader from "@/components/ui/Loader";
import { useLoginForm } from "@/hooks/useLoginForm";
import { useRegisterForm } from "@/hooks/useRegisterForm";
import { useFormAnimation } from "@/hooks/useFormAnimation";

/**
 * Interactive authentication client component.
 *
 * This client component provides a sophisticated authentication interface
 * featuring animated 3D card-flip transitions between login and registration
 * forms. It manages authentication state, form validation, loading states,
 * and provides smooth user experience transitions.
 *
 * @remarks
 * The component implements several key features:
 * - **3D Card Animation**: CSS transform-based card flip between login/register
 * - **Form State Management**: Separate hooks for login and registration logic
 * - **Route Prefetching**: Optimizes navigation performance to "/home"
 * - **Body Overflow Control**: Prevents scrolling during authentication
 * - **Loading States**: Shows spinner during authentication requests
 * - **Responsive Design**: Adapts to different screen sizes with Tailwind CSS
 *
 * The authentication flow includes:
 * 1. User sees login form by default
 * 2. Can flip to registration form with animated transition
 * 3. Form submission triggers loading state
 * 4. Success redirects to home dashboard
 * 5. Errors are displayed with form validation feedback
 *
 * @example
 * ```tsx
 * // Rendered by the root page server component
 * function LoginClient() {
 *   const { isFlipped, flipToRegister, flipToLogin } = useFormAnimation();
 *   const loginForm = useLoginForm();
 *
 *   return (
 *     <div className="login-container">
 *       <div className={isFlipped ? "rotate-y-180" : ""}>
 *         <LoginForm {...loginForm} />
 *         <RegisterForm {...registerForm} />
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns The authentication interface with animated login/register forms,
 * loading states, and responsive design.
 *
 * @see {@link useLoginForm} - Hook managing login form state and validation
 * @see {@link useRegisterForm} - Hook managing registration form state
 * @see {@link useFormAnimation} - Hook controlling card flip animations
 * @see {@link LoginForm} - Login form component with validation
 * @see {@link RegisterForm} - Registration form component with validation
 *
 * @public
 */
export default function LoginClient() {
  const router = useRouter();
  const { isFlipped, flipToRegister, flipToLogin } = useFormAnimation();

  const loginForm = useLoginForm();
  const registerForm = useRegisterForm();

  useEffect(() => {
    router.prefetch("/home");
  }, [router]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="login-container w-full h-full flex items-center justify-center font-sans px-6 py-1"
      style={{
        minHeight: "calc(100vh - 8.5rem)",
      }}
    >
      {loginForm.showLoader ? (
        <Loader />
      ) : (
        <div className="login-perspective">
          <div
            className={`
							relative
							w-[340px] h-[500px] sm:w-[320px] sm:h-[480px] xs:w-[300px] xs:h-[460px]
							transition-transform duration-500
							[transform-style:preserve-3d]
							rounded-2xl
							${isFlipped ? "rotate-y-180" : ""}
						`}
          >
            <LoginForm
              usernameOrEmail={loginForm.usernameOrEmail}
              setUsernameOrEmail={loginForm.setUsernameOrEmail}
              password={loginForm.password}
              setPassword={loginForm.setPassword}
              error={loginForm.error}
              success={loginForm.success}
              isLoggingIn={loginForm.isLoggingIn}
              onSubmit={loginForm.handleSubmit}
              onFlipToRegister={() => flipToRegister(loginForm.clearMessages)}
            />

            <RegisterForm
              rUser={registerForm.rUser}
              setRUser={registerForm.setRUser}
              rEmail={registerForm.rEmail}
              setREmail={registerForm.setREmail}
              rPass={registerForm.rPass}
              setRPass={registerForm.setRPass}
              rPass2={registerForm.rPass2}
              setRPass2={registerForm.setRPass2}
              rStatus={registerForm.rStatus}
              isRegistering={registerForm.isRegistering}
              onSubmit={() => registerForm.handleSubmit(() => flipToLogin())}
              onFlipToLogin={() => flipToLogin(registerForm.clearStatus)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
