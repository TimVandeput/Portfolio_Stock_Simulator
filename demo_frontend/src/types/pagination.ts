/**
 * @fileoverview Pagination and Paged Data Type Definitions
 * @author Tim Vandeput
 * @since 1.0.0
 */

/**
 * Generic paginated response structure for API endpoints.
 *
 * Represents a page of data returned from paginated API endpoints,
 * including the data content and pagination metadata. Used throughout
 * the application for handling large datasets with page-based navigation.
 *
 * @template T - Type of items contained in the page
 * @interface Page
 * @property {T[]} content - Array of items for the current page
 * @property {number} totalElements - Total number of items across all pages
 * @property {number} totalPages - Total number of pages available
 * @property {number} number - Current page number (0-based index)
 * @property {number} size - Number of items per page (page size)
 *
 * @example
 * ```typescript
 * // Transaction history pagination
 * interface TransactionPage extends Page<Transaction> {}
 *
 * const transactionPage: TransactionPage = {
 *   content: [
 *     { id: 1, symbol: "AAPL", quantity: 10, type: "BUY" },
 *     { id: 2, symbol: "GOOGL", quantity: 5, type: "SELL" }
 *   ],
 *   totalElements: 150,
 *   totalPages: 15,
 *   number: 0,
 *   size: 10
 * };
 * ```
 *
 * @example
 * ```typescript
 * // Pagination hook usage
 * function usePaginatedData<T>(endpoint: string, pageSize: number = 10) {
 *   const [currentPage, setCurrentPage] = useState(0);
 *   const [data, setData] = useState<Page<T> | null>(null);
 *   const [loading, setLoading] = useState(false);
 *
 *   const fetchPage = async (page: number) => {
 *     setLoading(true);
 *     try {
 *       const response = await api.get<Page<T>>(`${endpoint}?page=${page}&size=${pageSize}`);
 *       setData(response.data);
 *       setCurrentPage(page);
 *     } finally {
 *       setLoading(false);
 *     }
 *   };
 *
 *   return {
 *     data,
 *     loading,
 *     currentPage,
 *     totalPages: data?.totalPages || 0,
 *     goToPage: fetchPage,
 *     nextPage: () => fetchPage(currentPage + 1),
 *     prevPage: () => fetchPage(currentPage - 1)
 *   };
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Pagination component
 * function PaginationControls<T>({ page, onPageChange }: {
 *   page: Page<T>;
 *   onPageChange: (pageNumber: number) => void;
 * }) {
 *   const { number: currentPage, totalPages, totalElements, size } = page;
 *
 *   const startItem = currentPage * size + 1;
 *   const endItem = Math.min((currentPage + 1) * size, totalElements);
 *
 *   return (
 *     <div className="pagination">
 *       <span className="pagination-info">
 *         Showing {startItem}-{endItem} of {totalElements} items
 *       </span>
 *
 *       <div className="pagination-controls">
 *         <button
 *           disabled={currentPage === 0}
 *           onClick={() => onPageChange(currentPage - 1)}
 *         >
 *           Previous
 *         </button>
 *
 *         <span>Page {currentPage + 1} of {totalPages}</span>
 *
 *         <button
 *           disabled={currentPage >= totalPages - 1}
 *           onClick={() => onPageChange(currentPage + 1)}
 *         >
 *           Next
 *         </button>
 *       </div>
 *     </div>
 *   );
 * }
 * ```
 */
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
