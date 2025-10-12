/**
 * @fileoverview Professional access control modal for authentication and authorization management
 *
 * This component provides comprehensive access control messaging with context-aware
 * content, professional styling, and intelligent navigation handling. Features include
 * login requirements, role-based permissions, keyboard navigation, and seamless
 * integration with authentication and authorization workflows.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DynamicIcon from "./DynamicIcon";
import { serverLogout } from "@/app/actions/logout";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for NoAccessModal component configuration
 * @interface NoAccessModalProps
 * @extends {BaseComponentProps}
 */
export interface NoAccessModalProps extends BaseComponentProps {
  /** Whether the modal is currently visible */
  isOpen: boolean;
  /** Custom title for the modal (uses context-aware default if not provided) */
  title?: string;
  /** Main message explaining the access restriction */
  message: string;
  /** Custom text for the action button (uses context-aware default if not provided) */
  closeText?: string;
  /** Callback function for modal dismissal */
  onClose: () => void;
  /** Type of access control determining default behavior */
  accessType?: "login" | "role" | "general";
}

/**
 * Professional access control modal for authentication and authorization management
 *
 * @remarks
 * The NoAccessModal component delivers comprehensive access control with the following features:
 *
 * **Access Control Types:**
 * - Login type: Redirects to authentication page
 * - Role type: Handles insufficient permissions
 * - General type: Generic access denial
 * - Context-aware default messaging and actions
 *
 * **Navigation Integration:**
 * - Automatic navigation to login page for authentication
 * - Home page redirection for role-based restrictions
 * - Custom callback handling for general access
 * - Professional routing with Next.js integration
 *
 * **Accessibility Features:**
 * - Full ARIA modal implementation
 * - Screen reader compatible structure
 * - Automatic focus management
 * - Keyboard navigation with escape key support
 *
 * **Modal Behavior:**
 * - Body scroll lock when active
 * - Theme integration with custom events
 * - Professional modal lifecycle management
 * - Clean component unmount handling
 *
 * **Visual Design:**
 * - Professional alert icon with danger styling
 * - Neumorphic design language integration
 * - Clean typography and spacing
 * - Professional shadow and border styling
 *
 * **Interactive Features:**
 * - Context-aware button text and actions
 * - Auto-focus on primary action button
 * - Professional hover and active states
 * - Smooth transition animations
 *
 * **Error Messaging:**
 * - Clear access denial explanations
 * - Professional error communication
 * - Context-specific messaging
 * - User-friendly guidance
 *
 * **Theme Integration:**
 * - CSS custom properties for consistent styling
 * - Modal-specific styling variables
 * - Professional color palette
 * - Dynamic theme synchronization
 *
 * **Security Integration:**
 * - Authentication workflow integration
 * - Role-based access control support
 * - Professional security messaging
 * - Clear permission boundaries
 *
 * **Performance:**
 * - Conditional rendering for optimal performance
 * - Efficient event listener management
 * - Clean lifecycle management
 * - Professional component optimization
 *
 * @param props - Configuration object for access control modal
 * @returns NoAccessModal component with professional access control interface
 *
 * @example
 * ```tsx
 * // Login required modal
 * <NoAccessModal
 *   isOpen={showLoginModal}
 *   accessType="login"
 *   message="Please log in to access your portfolio."
 *   onClose={() => setShowLoginModal(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Role-based access restriction
 * <NoAccessModal
 *   isOpen={showRoleModal}
 *   accessType="role"
 *   message="This feature is only available to premium users."
 *   onClose={() => setShowRoleModal(false)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Integration with route protection
 * function ProtectedRoute({ children }: { children: React.ReactNode }) {
 *   const { user, isLoading } = useAuth();
 *   const [showAccessModal, setShowAccessModal] = useState(false);
 *
 *   useEffect(() => {
 *     if (!isLoading && !user) {
 *       setShowAccessModal(true);
 *     }
 *   }, [user, isLoading]);
 *
 *   if (isLoading) {
 *     return <Loader cover="page" />;
 *   }
 *
 *   if (!user) {
 *     return (
 *       <NoAccessModal
 *         isOpen={showAccessModal}
 *         accessType="login"
 *         message="You need to be logged in to access this page."
 *         onClose={() => setShowAccessModal(false)}
 *       />
 *     );
 *   }
 *
 *   return children;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Advanced access control with custom actions
 * function AdvancedAccessControl() {
 *   const { user } = useAuth();
 *   const [accessDenied, setAccessDenied] = useState(false);
 *
 *   const checkAccess = (requiredRole: string) => {
 *     if (!user || !user.roles.includes(requiredRole)) {
 *       setAccessDenied(true);
 *       return false;
 *     }
 *     return true;
 *   };
 *
 *   return (
 *     <>
 *       <button
 *         onClick={() => {
 *           if (checkAccess('admin')) {
 *             // Proceed with admin action
 *           }
 *         }}
 *       >
 *         Admin Action
 *       </button>
 *
 *       <NoAccessModal
 *         isOpen={accessDenied}
 *         accessType="role"
 *         title="Admin Access Required"
 *         message="This action requires administrator privileges."
 *         closeText="Contact Admin"
 *         onClose={() => {
 *           setAccessDenied(false);
 *           // Custom action: redirect to contact form
 *           router.push('/contact?reason=access_request');
 *         }}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export default function NoAccessModal({
  isOpen,
  title,
  message,
  closeText,
  onClose,
  accessType = "general",
}: NoAccessModalProps) {
  const router = useRouter();

  const defaultTitle =
    accessType === "login"
      ? "Login Required"
      : accessType === "role"
      ? "Insufficient Permissions"
      : "Access Denied";

  const modalTitle = title || defaultTitle;

  const defaultCloseText =
    accessType === "login"
      ? "Go to Login"
      : accessType === "role"
      ? "Go to Home"
      : "OK";

  const buttonText = closeText || defaultCloseText;

  const handleButtonClick = async () => {
    if (accessType === "login") {
      onClose();
      // Use server action to clear cookies server-side and redirect
      await serverLogout();
    } else if (accessType === "role") {
      router.push("/home");
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const modalElement = document.querySelector('[role="dialog"]');
      if (modalElement) {
        (modalElement as HTMLElement).focus();
      }

      setTimeout(() => {
        const event = new CustomEvent("themeChanged");
        window.dispatchEvent(event);
      }, 10);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center py-16 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
    >
      <div className="modal-base rounded-2xl p-8 max-w-sm w-full mx-auto shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <DynamicIcon
            iconName="alert-circle"
            size={24}
            className="icon-danger"
          />
          <h2 id="modal-title" className="modal-title text-xl font-bold">
            {modalTitle}
          </h2>
        </div>

        <p id="modal-description" className="modal-text mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleButtonClick}
            className="neu-button neumorphic-button px-8 py-3 rounded-xl font-medium transition-all duration-150 active:translate-y-0.5 active:duration-75"
            autoFocus
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
