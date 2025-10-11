package com.portfolio.demo_backend.marketdata.mapper;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.dto.PriceEvent;
import com.portfolio.demo_backend.marketdata.service.data.PriceData;
import com.portfolio.demo_backend.marketdata.integration.RapidApiClient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

/**
 * MapStruct mapper for market data conversions.
 * <p>
 * Responsibilities:
 * - Convert provider quotes ({@link RapidApiClient.Quote}) to internal DTOs ({@link YahooQuoteDTO}, {@link PriceData})
 * - Create compact {@link PriceEvent} messages from raw values or {@link PriceData}
 * - Apply conventions: default currency USD, fill timestamps, ignore unsupported fields
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MarketDataMapper {

    /**
     * Maps a RapidAPI quote to a {@link YahooQuoteDTO}.
     * - currency forced to USD
     * - marketCap/volume ignored (not provided by source)
     */
    @Mapping(target = "currency", constant = "USD")
    @Mapping(target = "marketCap", ignore = true)
    @Mapping(target = "volume", ignore = true)
    YahooQuoteDTO toYahooQuoteDTO(RapidApiClient.Quote quote);

    /**
     * Maps a RapidAPI quote to a compact {@link PriceData} with current timestamp and USD currency.
     */
    @Mapping(target = "timestamp", expression = "java(System.currentTimeMillis())")
    @Mapping(target = "currency", constant = "USD")
    PriceData toPriceData(RapidApiClient.Quote quote);

    /**
     * Builds a {@link PriceEvent} for a symbol.
     * - type is set to "price"
     * - ts (epoch millis) is set to now
     * - percentChange sourced from parameter
     */
    @Mapping(target = "type", constant = "price")
    @Mapping(target = "ts", expression = "java(System.currentTimeMillis())")
    @Mapping(target = "percentChange", source = "changePercent")
    PriceEvent toPriceEvent(String symbol, Double price, Double changePercent);

    /**
     * Converts {@link PriceData} to a {@link YahooQuoteDTO}.
     */
    YahooQuoteDTO fromPriceData(PriceData priceData);

    /**
     * Converts {@link PriceData} to a {@link PriceEvent} with a custom type label.
     */
    PriceEvent fromPriceData(PriceData priceData, String type);
}
