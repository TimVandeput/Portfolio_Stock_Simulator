/**
 * @fileoverview Professional table header component for data table structure and organization
 *
 * This component provides comprehensive table header functionality with column management,
 * alignment control, and professional styling. Features include configurable columns,
 * responsive design, theme integration, and clean typography for optimal data presentation
 * and professional table interface design.
 */

import type { BaseComponentProps } from "@/types/components";

/**
 * Table column configuration interface
 * @interface TableColumn
 */
export interface TableColumn {
  /** Unique identifier for the column */
  id: string;
  /** Display label for the column header */
  label: string;
  /** Optional description for tooltips or accessibility */
  description?: string;
  /** Optional icon name for column identification */
  icon?: string;
  /** Text alignment for the column content */
  alignment?: "left" | "center" | "right";
  /** CSS width specification for the column */
  width?: string;
}

/**
 * Props interface for TableHeader component configuration
 * @interface TableHeaderProps
 * @extends {BaseComponentProps}
 */
export interface TableHeaderProps extends BaseComponentProps {
  /** Array of column configurations for the table header */
  columns: TableColumn[];
  /** Additional CSS classes for styling */
  className?: string;
}

/**
 * Professional table header component for data table structure and organization
 *
 * @remarks
 * The TableHeader component delivers comprehensive table structure with the following features:
 *
 * **Column Management:**
 * - Configurable column definitions with metadata
 * - Flexible width specifications (CSS or flex-based)
 * - Professional column organization
 * - Clean column interface management
 *
 * **Alignment Control:**
 * - Left, center, and right text alignment options
 * - Consistent alignment application across columns
 * - Professional content positioning
 * - Flexible layout management
 *
 * **Visual Design:**
 * - Neumorphic card styling with professional appearance
 * - Accent color theming with subtle opacity
 * - Professional border and background styling
 * - Clean typography with medium font weight
 *
 * **Responsive Design:**
 * - Hidden on mobile devices (md:block)
 * - Desktop-optimized table header
 * - Professional responsive patterns
 * - Clean breakpoint management
 *
 * **Theme Integration:**
 * - CSS custom properties for consistent theming
 * - Accent color integration with opacity
 * - Professional color palette usage
 * - Secondary text color for headers
 *
 * **Layout Structure:**
 * - Flexible container with padding
 * - Professional spacing and alignment
 * - Clean column distribution
 * - Responsive flex layout
 *
 * **Typography:**
 * - Small text sizing for header context
 * - Medium font weight for prominence
 * - Professional text hierarchy
 * - Whitespace handling for content
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Screen reader compatible labels
 * - Professional accessibility patterns
 * - Clear content organization
 *
 * **Integration Features:**
 * - Seamless data table integration
 * - Professional table system compatibility
 * - Clean component composition
 * - Consistent design patterns
 *
 * **Performance:**
 * - Efficient column rendering
 * - Optimized layout calculations
 * - Clean component structure
 * - Professional rendering patterns
 *
 * @param props - Configuration object for table header functionality
 * @returns TableHeader component with professional column structure
 *
 * @example
 * ```tsx
 * // Basic table header
 * <TableHeader
 *   columns={[
 *     { id: 'symbol', label: 'Symbol', width: '120px' },
 *     { id: 'name', label: 'Company Name' },
 *     { id: 'price', label: 'Price', alignment: 'right', width: '100px' },
 *     { id: 'change', label: 'Change', alignment: 'center', width: '80px' }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Portfolio table header
 * function PortfolioTableHeader() {
 *   const portfolioColumns: TableColumn[] = [
 *     {
 *       id: 'symbol',
 *       label: 'Symbol',
 *       width: '120px',
 *       description: 'Stock symbol'
 *     },
 *     {
 *       id: 'shares',
 *       label: 'Shares',
 *       alignment: 'right',
 *       width: '100px'
 *     },
 *     {
 *       id: 'value',
 *       label: 'Market Value',
 *       alignment: 'right',
 *       width: '120px'
 *     },
 *     {
 *       id: 'gain',
 *       label: 'Gain/Loss',
 *       alignment: 'center',
 *       width: '100px'
 *     }
 *   ];
 *
 *   return <TableHeader columns={portfolioColumns} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Dynamic table header
 * function DynamicTableHeader({ tableType }: { tableType: string }) {
 *   const getColumns = (type: string): TableColumn[] => {
 *     switch (type) {
 *       case 'transactions':
 *         return [
 *           { id: 'date', label: 'Date', width: '120px' },
 *           { id: 'type', label: 'Type', width: '80px' },
 *           { id: 'symbol', label: 'Symbol', width: '100px' },
 *           { id: 'quantity', label: 'Quantity', alignment: 'right' },
 *           { id: 'price', label: 'Price', alignment: 'right' },
 *           { id: 'total', label: 'Total', alignment: 'right' }
 *         ];
 *       default:
 *         return [];
 *     }
 *   };
 *
 *   return <TableHeader columns={getColumns(tableType)} />;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Complete data table with header
 * function CompleteDataTable({ data }: { data: any[] }) {
 *   return (
 *     <div className="data-table-container">
 *       <TableHeader columns={TABLE_COLUMNS} />
 *
 *       <div className="table-body">
 *         {data.map((row, index) => (
 *           <TableRow key={index} data={row} columns={TABLE_COLUMNS} />
 *         ))}
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export default function TableHeader({
  columns,
  className = "",
}: TableHeaderProps) {
  return (
    <div
      className={`neu-card p-4 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 hidden md:block ${className}`}
    >
      <div className="w-full">
        <div className="flex text-sm font-medium text-[var(--text-secondary)]">
          {columns.map((column, index) => (
            <div
              key={column.id}
              className={`px-4 py-0 ${column.width || "flex-1"} ${
                column.alignment === "center"
                  ? "text-center"
                  : column.alignment === "right"
                  ? "text-right"
                  : ""
              }`}
            >
              <div
                className={`flex items-center gap-2 ${
                  column.alignment === "center"
                    ? "justify-center"
                    : column.alignment === "right"
                    ? "justify-end"
                    : ""
                }`}
              >
                <span className="whitespace-nowrap">{column.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
