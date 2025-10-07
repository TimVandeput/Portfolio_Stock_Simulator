package com.portfolio.demo_backend.marketdata.mapper;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.dto.PriceEvent;
import com.portfolio.demo_backend.marketdata.service.data.PriceData;
import com.portfolio.demo_backend.marketdata.integration.RapidApiClient;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface MarketDataMapper {

    @Mapping(target = "currency", constant = "USD")
    @Mapping(target = "marketCap", ignore = true)
    @Mapping(target = "volume", ignore = true)
    YahooQuoteDTO toYahooQuoteDTO(RapidApiClient.Quote quote);

    @Mapping(target = "timestamp", expression = "java(System.currentTimeMillis())")
    @Mapping(target = "currency", constant = "USD")
    PriceData toPriceData(RapidApiClient.Quote quote);

    @Mapping(target = "type", constant = "price")
    @Mapping(target = "ts", expression = "java(System.currentTimeMillis())")
    @Mapping(target = "percentChange", source = "changePercent")
    PriceEvent toPriceEvent(String symbol, Double price, Double changePercent);

    YahooQuoteDTO fromPriceData(PriceData priceData);

    PriceEvent fromPriceData(PriceData priceData, String type);
}
