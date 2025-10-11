/**
 * @fileoverview Universe import control bar for stock symbol management.
 *
 * This module provides a comprehensive control interface for importing and
 * refreshing stock symbol universes (NASDAQ-100, S&P 500) within the Stock
 * Simulator platform. It combines universe selection with import functionality
 * through an intuitive interface designed for administrative symbol management
 * operations.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import NeumorphicButton from "@/components/button/NeumorphicButton";
import type { Universe } from "@/types/symbol";
import type { BaseComponentProps } from "@/types/components";

/**
 * Props interface for the UniverseImportBar component.
 * @interface UniverseImportBarProps
 * @extends BaseComponentProps
 */
export interface UniverseImportBarProps extends BaseComponentProps {
  /** Currently selected universe (NDX or GSPC) */
  universe: Universe;
  /** Callback function to change the selected universe */
  setUniverse: (u: Universe) => void;
  /** Callback function to trigger import/refresh operation */
  onImport: () => void;
  /** Whether the import operation is busy/processing */
  importBusy: boolean;
  /** Whether the import operation is currently running */
  importRunning: boolean;
}

/**
 * Universe import control bar with selection and import functionality.
 *
 * This comprehensive control interface provides administrators with the ability
 * to select and import stock symbol universes (NASDAQ-100, S&P 500) within
 * the Stock Simulator platform. It combines intuitive universe selection with
 * robust import functionality, loading state management, and responsive design
 * for efficient symbol database management operations.
 *
 * @remarks
 * The component delivers comprehensive universe management functionality through:
 *
 * **Universe Selection System**:
 * - **Multi-Universe Support**: NASDAQ-100 (NDX) and S&P 500 (GSPC) selection
 * - **Dropdown Interface**: Clean select element with themed styling
 * - **Immediate Selection**: Real-time universe switching without delays
 * - **Accessibility Labels**: Proper ARIA labeling for screen readers
 *
 * **Import Management Controls**:
 * - **Import/Refresh Functionality**: Single button for both import and refresh operations
 * - **Loading State Integration**: Visual feedback during import processing
 * - **Operation Prevention**: Disables controls during active import operations
 * - **Status Communication**: Clear button text indicating current operation state
 *
 * **Responsive Design Features**:
 * - **Mobile-First Layout**: Stacked layout on mobile, horizontal on desktop
 * - **Flexible Grid System**: Adapts control layout based on screen size
 * - **Touch-Friendly Controls**: Optimized sizing for mobile interactions
 * - **Consistent Spacing**: Proper gap management across different layouts
 *
 * **State Management Integration**:
 * - **Busy State Handling**: Proper handling of import busy and running states
 * - **Disabled State Logic**: Smart control disabling during operations
 * - **Loading Indicators**: Visual feedback through button text changes
 * - **ARIA Live Regions**: Accessibility support for dynamic state changes
 *
 * **Administrative Interface Features**:
 * - **Symbol Database Management**: Direct interface for symbol import operations
 * - **Universe Switching**: Seamless switching between different stock universes
 * - **Batch Operations**: Efficient import of entire symbol universes
 * - **Data Refresh**: Capability to refresh existing symbol datasets
 *
 * **Visual Design Integration**:
 * - **Platform Theming**: Consistent theming with CSS custom properties
 * - **Neumorphic Button**: Integration with platform button design system
 * - **Consistent Styling**: Unified visual language across control elements
 * - **Responsive Typography**: Appropriate text sizing for different screen sizes
 *
 * **Accessibility Standards**:
 * - **Screen Reader Support**: Comprehensive labeling and ARIA attributes
 * - **Keyboard Navigation**: Full keyboard accessibility for all controls
 * - **Live Region Updates**: Dynamic content updates announced to assistive technologies
 * - **Focus Management**: Proper focus handling during state transitions
 *
 * **Performance Optimizations**:
 * - **Efficient State Updates**: Minimal re-renders through proper prop handling
 * - **Lightweight Implementation**: Clean component structure with minimal overhead
 * - **Conditional Rendering**: Smart control enabling based on operation states
 * - **Event Delegation**: Efficient event handling for user interactions
 *
 * The component serves as a critical administrative tool for symbol database
 * management, providing administrators with efficient and intuitive controls
 * for maintaining up-to-date stock symbol universes within the Stock Simulator
 * platform while maintaining accessibility and usability standards.
 *
 * @example
 * ```tsx
 * // Basic universe import bar usage
 * function SymbolsAdminPanel() {
 *   const [selectedUniverse, setSelectedUniverse] = useState<Universe>('NDX');
 *   const [importBusy, setImportBusy] = useState(false);
 *   const [importRunning, setImportRunning] = useState(false);
 *
 *   const handleImport = async () => {
 *     setImportBusy(true);
 *     setImportRunning(true);
 *
 *     try {
 *       await importUniverseSymbols(selectedUniverse);
 *       console.log(`Successfully imported ${selectedUniverse} symbols`);
 *     } catch (error) {
 *       console.error('Import failed:', error);
 *     } finally {
 *       setImportBusy(false);
 *       setImportRunning(false);
 *     }
 *   };
 *
 *   return (
 *     <div className="admin-panel">
 *       <h2>Symbol Management</h2>
 *       <UniverseImportBar
 *         universe={selectedUniverse}
 *         setUniverse={setSelectedUniverse}
 *         onImport={handleImport}
 *         importBusy={importBusy}
 *         importRunning={importRunning}
 *       />
 *       <SymbolsTable universe={selectedUniverse} />
 *     </div>
 *   );
 * }
 *
 * // Integration with symbol management system
 * function SymbolsManagement() {
 *   const {
 *     universe,
 *     setUniverse,
 *     importSymbols,
 *     importState
 *   } = useSymbolsManagement();
 *
 *   return (
 *     <div className="symbols-management">
 *       <UniverseImportBar
 *         universe={universe}
 *         setUniverse={setUniverse}
 *         onImport={importSymbols}
 *         importBusy={importState.busy}
 *         importRunning={importState.running}
 *       />
 *       <ImportStatus status={importState} />
 *       <SymbolsList universe={universe} />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param props - Component properties for universe selection and import functionality
 * @returns A comprehensive universe import control bar with selection dropdown,
 * import button, loading states, and responsive design
 *
 * @see {@link NeumorphicButton} - Button component for import operations
 * @see {@link Universe} - TypeScript type for supported stock universes
 * @see {@link BaseComponentProps} - Base properties interface for components
 *
 * @public
 */
export default function UniverseImportBar({
  universe,
  setUniverse,
  onImport,
  importBusy,
  importRunning,
}: UniverseImportBarProps) {
  const disabled = importBusy || importRunning;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
      <select
        value={universe}
        onChange={(e) => setUniverse(e.target.value as Universe)}
        className="px-3 py-2 rounded-xl border bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] w-full sm:w-auto"
        aria-label="Universe"
      >
        <option value="NDX">NASDAQ-100</option>
        <option value="GSPC">S&amp;P 500</option>
      </select>

      <div className="w-[160px] mb-3 sm:mb-0">
        <NeumorphicButton
          onClick={onImport}
          disabled={disabled}
          aria-live="polite"
          aria-busy={disabled}
          className="w-full "
        >
          {disabled ? "Importing…" : "Import / Refresh"}
        </NeumorphicButton>
      </div>
    </div>
  );
}
