/**
 * @fileoverview Component Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

import { ReactNode } from "react";

/**
 * Base props interface for all React components in the application.
 *
 * Provides common properties that all components should support
 * for consistent styling, identification, and testing capabilities.
 *
 * @interface BaseComponentProps
 * @property {string} [className] - CSS class names for styling
 * @property {ReactNode} [children] - Child elements to render
 * @property {string} [id] - Unique HTML element identifier
 * @property {string} [data-testid] - Test identifier for automated testing
 *
 * @example
 * ```typescript
 * const MyComponent: React.FC<BaseComponentProps> = ({
 *   className,
 *   children,
 *   id,
 *   "data-testid": testId
 * }) => (
 *   <div className={className} id={id} data-testid={testId}>
 *     {children}
 *   </div>
 * );
 * ```
 */
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  "data-testid"?: string;
}

/**
 * Application mode for context-specific UI rendering.
 *
 * Determines the current operational mode of the application,
 * affecting available features, navigation, and user permissions.
 *
 * @typedef {"admin" | "market"} Mode
 * @property {string} admin - Administrative mode with full access
 * @property {string} market - Market trading mode for regular users
 *
 * @example
 * ```typescript
 * const [currentMode, setCurrentMode] = useState<Mode>("market");
 *
 * if (currentMode === "admin") {
 *   return <AdminDashboard />;
 * } else {
 *   return <MarketInterface />;
 * }
 * ```
 */
export type Mode = "admin" | "market";

/**
 * Standard click event handler function type.
 *
 * Used for button clicks, menu selections, and other
 * user interaction events that don't require parameters.
 *
 * @typedef {() => void} ClickHandler
 *
 * @example
 * ```typescript
 * const handleButtonClick: ClickHandler = () => {
 *   console.log("Button clicked");
 * };
 *
 * <button onClick={handleButtonClick}>Click Me</button>
 * ```
 */
export type ClickHandler = () => void;

/**
 * Input change event handler function type.
 *
 * Used for form inputs, select elements, and other
 * components that need to handle value changes.
 *
 * @typedef {(value: string) => void} ChangeHandler
 * @param {string} value - The new input value
 *
 * @example
 * ```typescript
 * const handleInputChange: ChangeHandler = (value) => {
 *   setInputValue(value);
 * };
 *
 * <input onChange={(e) => handleInputChange(e.target.value)} />
 * ```
 */
export type ChangeHandler = (value: string) => void;

/**
 * Form submission event handler function type.
 *
 * Used for form submissions and other events that
 * need to handle React form events with preventDefault.
 *
 * @typedef {(e: React.FormEvent) => void} SubmitHandler
 * @param {React.FormEvent} e - The form submission event
 *
 * @example
 * ```typescript
 * const handleFormSubmit: SubmitHandler = (e) => {
 *   e.preventDefault();
 *   // Process form data
 * };
 * ```
 */
export type SubmitHandler = (e: React.FormEvent) => void;
