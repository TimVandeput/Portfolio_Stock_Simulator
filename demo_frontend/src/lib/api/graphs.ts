import { HttpClient, ApiError } from "@/lib/api/http";

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
