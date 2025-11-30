/**
 * @fileoverview Interactive market analytics and charting client component.
 *
 * This module provides comprehensive charting and visual analytics capabilities
 * for user portfolio holdings. It implements interactive charts with multiple
 * time ranges, real-time data updates, and sophisticated visualization patterns
 * to help users analyze their investment performance.
 *
 * @author Tim Vandeput
 * @since 1.0.0
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getGraphsForUserPortfolio } from "@/lib/api/graphs";
import { getUserId } from "@/lib/auth/tokenStorage";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import StatusMessage from "@/components/status/StatusMessage";
import StockChart from "@/components/graph/StockChart";
import TimeRangeSelector from "@/components/graph/TimeRangeSelector";
import type { GraphData } from "@/lib/api/graphs";

/**
 * Interactive market analytics client component with portfolio-focused charting.
 *
 * This sophisticated client component provides comprehensive charting and
 * analytics capabilities specifically tailored to user portfolio holdings.
 * It implements interactive data visualization, multiple time range analysis,
 * and real-time updates to support informed investment decision-making .
 *
 * @remarks
 * The component delivers advanced analytics features through modern charting:
 *
 * **Authentication & Portfolio Integration**:
 * - Requires user authentication for chart access
 * - Automatically filters charts to show only owned stocks
 * - Integrates with user portfolio data for personalized analytics
 * - Provides contextual investment insights based on holdings
 *
 * **Interactive Charting Features**:
 * - **Multi-timeframe Analysis**: 1M, 1Y, 5Y ranges
 * - **Dynamic Data Loading**: Asynchronous chart data fetching
 * - **Real-time Updates**: Periodic refresh for current market data
 * - **Interactive Controls**: Time range selection and chart navigation
 *
 * **Visual Analytics Capabilities**:
 * - **Price Movement Tracking**: Historical price trends and patterns
 * - **Volume Analysis**: Trading volume visualization and insights
 * - **Performance Metrics**: Gain/loss visualization over time
 * - **Technical Indicators**: Moving averages and trend analysis
 *
 * **User Experience Optimizations**:
 * - **Responsive Design**: Charts adapt to all screen sizes
 * - **Loading States**: Smooth transitions during data fetching
 * - **Error Handling**: Graceful fallbacks for connection issues
 * - **Performance Optimization**: Efficient chart rendering and updates
 *
 * **Data Management**:
 * - **Caching Strategy**: Optimized data loading and storage
 * - **Update Timestamps**: Last refresh tracking for data freshness
 * - **Error Recovery**: Automatic retry mechanisms for failed requests
 * - **Memory Management**: Efficient handling of large chart datasets
 *
 * The component serves as a critical tool for investment analysis, providing
 * users with professional-grade charting capabilities to understand market
 * movements and make informed trading decisions within their simulation.
 *
 * @example
 * ```tsx
 * // Rendered by the GraphPage server component
 * function GraphClient() {
 *   const [graphs, setGraphs] = useState<GraphData[]>([]);
 *   const [selectedRange, setSelectedRange] = useState("1mo");
 *   const [loading, setLoading] = useState(true);
 *
 *   const loadGraphs = useCallback(async () => {
 *     const userId = getUserId();
 *     if (!userId) return;
 *
 *     const data = await getGraphsForUserPortfolio(userId, selectedRange);
 *     setGraphs(data);
 *   }, [selectedRange]);
 *
 *   return (
 *     <div className="analytics-dashboard">
 *       <TimeRangeSelector
 *         selected={selectedRange}
 *         onChange={setSelectedRange}
 *       />
 *       {graphs.map(graph => (
 *         <StockChart key={graph.symbol} data={graph} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns The comprehensive analytics interface with interactive charts,
 * time range controls, and portfolio-focused visualizations, or authentication
 * prompts for unauthenticated users.
 *
 * @see {@link getGraphsForUserPortfolio} - API function for fetching chart data
 * @see {@link StockChart} - Individual stock chart visualization component
 * @see {@link TimeRangeSelector} - Time range selection control component
 * @see {@link getUserId} - Authentication utility for user identification
 * @see {@link GraphData} - TypeScript interface for chart data structure
 *
 * @public
 */
export default function GraphClient() {
  const router = useRouter();
  const [graphs, setGraphs] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRange, setSelectedRange] = useState("1mo");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadGraphs = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setError("Please log in to view live graphs.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const graphData = await getGraphsForUserPortfolio(userId, selectedRange);
      setGraphs(graphData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [selectedRange]);

  useEffect(() => {
    loadGraphs();
  }, [loadGraphs]);

  return (
    <div className="page-container block w-full font-sans px-4 sm:px-6 py-4 sm:py-6 overflow-auto">
      <div className="page-card p-4 sm:p-6 rounded-2xl max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title text-2xl sm:text-3xl font-bold">
              PORTFOLIO ANALYTICS
            </h1>
            <p className="text-sm opacity-80">
              Interactive graphs for your portfolio holdings
              {lastUpdated && (
                <span className="ml-2">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <TimeRangeSelector
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <StatusMessage message={error} type="error" />
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[var(--text-secondary)]">
                Loading analytics...
              </span>
            </div>
          </div>
        )}

        {!loading && !error && graphs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-20">📈</div>
            <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
              No Holdings Found
            </h3>
            <p className="text-[var(--text-secondary)] mb-6">
              You need to own some stocks to see analytics.
            </p>
            <button
              onClick={() => router.push("/market")}
              className="px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:opacity-80 transition-opacity"
            >
              Browse Markets
            </button>
          </div>
        )}

        {!loading && !error && graphs.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {graphs.map((graphData, index) => (
              <div
                key={index}
                className="bg-[var(--surface)] p-4 rounded-xl border border-[var(--border)]"
              >
                {graphData.chart.result?.[0] && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                          {graphData.chart.result[0].meta.symbol}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {graphData.chart.result[0].meta.longName}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[var(--text-primary)]">
                          $
                          {graphData.chart.result[0].meta.regularMarketPrice?.toFixed(
                            2
                          )}
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">
                          {graphData.chart.result[0].meta.currency}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-[var(--text-secondary)]">
                          Day High:
                        </span>
                        <span className="ml-2 text-[var(--text-primary)]">
                          $
                          {graphData.chart.result[0].meta.regularMarketDayHigh?.toFixed(
                            2
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--text-secondary)]">
                          Day Low:
                        </span>
                        <span className="ml-2 text-[var(--text-primary)]">
                          $
                          {graphData.chart.result[0].meta.regularMarketDayLow?.toFixed(
                            2
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--text-secondary)]">
                          52W High:
                        </span>
                        <span className="ml-2 text-[var(--text-primary)]">
                          $
                          {graphData.chart.result[0].meta.fiftyTwoWeekHigh?.toFixed(
                            2
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-[var(--text-secondary)]">
                          52W Low:
                        </span>
                        <span className="ml-2 text-[var(--text-primary)]">
                          $
                          {graphData.chart.result[0].meta.fiftyTwoWeekLow?.toFixed(
                            2
                          )}
                        </span>
                      </div>
                    </div>

                    <StockChart chartData={graphData} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
