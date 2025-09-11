package com.portfolio.demo_backend.marketdata.mapper;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.integration.RapidApiClient;

public class MarketDataMapper {

    public static YahooQuoteDTO toYahooQuoteDTO(RapidApiClient.Quote quote) {
        YahooQuoteDTO dto = new YahooQuoteDTO();
        dto.setSymbol(quote.symbol);
        dto.setPrice(quote.price);
        dto.setChange(quote.change);
        dto.setChangePercent(quote.changePercent);
        dto.setCurrency("USD");
        dto.setMarketCap(null);
        dto.setPreviousClose(quote.previousClose);
        dto.setDayHigh(quote.dayHigh);
        dto.setDayLow(quote.dayLow);
        dto.setVolume(null);
        return dto;
    }
}
