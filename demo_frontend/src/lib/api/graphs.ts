/**
 * @fileoverview Stock Chart Data API Module
 *
 * Provides comprehensive functionality for retrieving and processing
 * stock chart data from Yahoo Finance API. Handles complex chart data
 * structures including OHLCV data, metadata, trading periods, and
 * corporate actions like stock splits.
 *
 * @module lib/api/graphs
 * @author Tim Vandeput
 * @since 1.0.0
 *
 *
 * @example
 * ```typescript
 * import { getGraphsForUserPortfolio, GraphData } from '@/lib/api/graphs';
 *
 * // Get 1-month chart data for user's portfolio
 * const charts = await getGraphsForUserPortfolio(123, '1mo');
 * console.log('Retrieved charts for', charts.length, 'symbols');
 * ```
 */

import { HttpClient, ApiError } from "@/lib/api/http";

/**
 * Comprehensive interface representing Yahoo Finance chart data structure.
 *
 * Contains complete OHLCV (Open, High, Low, Close, Volume) data along with
 * extensive metadata, trading periods, and corporate actions information.
 *
 * @interface GraphData
 *
 * @example
 * ```typescript
 * const chartData: GraphData = {
 *   chart: {
 *     result: [{
 *       meta: {
 *         symbol: 'AAPL',
 *         currency: 'USD',
 *         regularMarketPrice: 150.25,
 *         // ... other metadata
 *       },
 *       timestamp: [1640995200, 1641081600, 1641168000],
 *       indicators: {
 *         quote: [{
 *           open: [148.50, 149.75, 151.20],
 *           high: [152.30, 153.10, 154.80],
 *           low: [147.80, 148.90, 150.50],
 *           close: [150.25, 151.45, 152.90],
 *           volume: [89234567, 76543210, 82345678]
 *         }],
 *         adjclose: [{
 *           adjclose: [150.25, 151.45, 152.90]
 *         }]
 *       }
 *     }],
 *     error: null
 *   }
 * };
 * ```
 */
export interface GraphData {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        fullExchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        hasPrePostMarketData: boolean;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        fiftyTwoWeekHigh: number;
        fiftyTwoWeekLow: number;
        regularMarketDayHigh: number;
        regularMarketDayLow: number;
        regularMarketVolume: number;
        longName: string;
        shortName: string;
        chartPreviousClose: number;
        priceHint: number;
        currentTradingPeriod: {
          pre: {
            timezone: string;
            end: number;
            start: number;
            gmtoffset: number;
          };
          regular: {
            timezone: string;
            end: number;
            start: number;
            gmtoffset: number;
          };
          post: {
            timezone: string;
            end: number;
            start: number;
            gmtoffset: number;
          };
        };
        dataGranularity: string;
        range: string;
        validRanges: string[];
      };
      timestamp: number[];
      events?: {
        splits?: Record<
          string,
          {
            date: number;
            numerator: number;
            denominator: number;
            splitRatio: string;
          }
        >;
      };
      indicators: {
        quote: Array<{
          high: number[];
          open: number[];
          volume: number[];
          low: number[];
          close: number[];
        }>;
        adjclose: Array<{
          adjclose: number[];
        }>;
      };
    }>;
    error: string | null;
  };
}

const client = new HttpClient();

/**
 * Retrieves comprehensive chart data for all symbols in a user's portfolio.
 *
 * Fetches detailed OHLCV chart data for every stock symbol currently held
 * in the specified user's portfolio. The data includes price history,
 * volume data, metadata, and corporate actions for the requested time range.
 *
 * @param userId - The unique identifier of the user whose portfolio charts to retrieve
 * @param range - Time range for chart data (default: "1mo")
 * @returns Promise resolving to array of comprehensive chart data objects
 *
 * @throws {ApiError} When API request fails or returns invalid data
 * @throws {Error} When network or parsing errors occur
 *
 * @remarks
 * This function:
 * - Retrieves charts for ALL symbols in user's portfolio
 * - Includes complete OHLCV data with timestamps
 * - Provides extensive metadata for each symbol
 * - Handles corporate actions (splits, dividends)
 * - Supports multiple time ranges (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
 * - Returns empty array if user has no portfolio positions
 * - Automatically handles authentication via HttpClient
 *
 * The returned data follows Yahoo Finance chart API structure and includes
 * comprehensive market data suitable for creating detailed financial charts.
 *
 * @example
 * ```typescript
 * // Get 1-month chart data for user's portfolio
 * const charts = await getGraphsForUserPortfolio(123);
 *
 * if (charts.length > 0) {
 *   charts.forEach(chart => {
 *     const result = chart.chart.result[0];
 *     console.log(`Symbol: ${result.meta.symbol}`);
 *     console.log(`Current Price: $${result.meta.regularMarketPrice}`);
 *     console.log(`Data Points: ${result.timestamp.length}`);
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Get 1-year data for detailed analysis
 * try {
 *   const yearlyCharts = await getGraphsForUserPortfolio(456, '1y');
 *
 *   yearlyCharts.forEach(chartData => {
 *     const chart = chartData.chart.result[0];
 *     const quotes = chart.indicators.quote[0];
 *     const timestamps = chart.timestamp;
 *
 *     // Calculate price statistics
 *     const closes = quotes.close.filter(price => price !== null);
 *     const avgPrice = closes.reduce((a, b) => a + b, 0) / closes.length;
 *
 *     console.log(`${chart.meta.symbol} Average Price: $${avgPrice.toFixed(2)}`);
 *   });
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('API Error:', error.message);
 *   } else {
 *     console.error('Unexpected error:', error);
 *   }
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React component using portfolio charts
 * function PortfolioChartsPage({ userId }: { userId: number }) {
 *   const [charts, setCharts] = useState<GraphData[]>([]);
 *   const [timeRange, setTimeRange] = useState('1mo');
 *   const [loading, setLoading] = useState(true);
 *
 *   useEffect(() => {
 *     const loadCharts = async () => {
 *       try {
 *         setLoading(true);
 *         const data = await getGraphsForUserPortfolio(userId, timeRange);
 *         setCharts(data);
 *       } catch (error) {
 *         console.error('Failed to load portfolio charts:', error);
 *       } finally {
 *         setLoading(false);
 *       }
 *     };
 *
 *     loadCharts();
 *   }, [userId, timeRange]);
 *
 *   if (loading) return <div>Loading portfolio charts...</div>;
 *
 *   return (
 *     <div>
 *       <h1>Portfolio Performance</h1>
 *       {charts.map((chartData, index) => {
 *         const chart = chartData.chart.result[0];
 *         return (
 *           <div key={index}>
 *             <h2>{chart.meta.symbol} - {chart.meta.longName}</h2>
 *             <ChartComponent data={chartData} />
 *           </div>
 *         );
 *       })}
 *     </div>
 *   );
 * }
 * ```
 */
export async function getGraphsForUserPortfolio(
  userId: number,
  range: string = "1mo"
): Promise<GraphData[]> {
  try {
    const url = `/api/market/charts/user/${userId}?range=${range}`;
    console.log("API call:", url);
    return await client.get<GraphData[]>(url);
  } catch (err) {
    if (err instanceof ApiError && err.body) {
      const b: any = err.body;
      throw new ApiError(
        err.status,
        b?.detail || b?.message || err.message,
        err.body
      );
    }
    throw err;
  }
}
