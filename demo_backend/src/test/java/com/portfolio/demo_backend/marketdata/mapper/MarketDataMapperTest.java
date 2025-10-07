package com.portfolio.demo_backend.marketdata.mapper;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.integration.RapidApiClient;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link MarketDataMapper} validating mapping from RapidAPI
 * Quote
 * payloads to {@link com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO}
 * across
 * typical and edge cases.
 */
class MarketDataMapperTest {

    private final MarketDataMapper mapper = Mappers.getMapper(MarketDataMapper.class);

    /**
     * Maps all available quote fields to the DTO.
     */
    @Test
    void toYahooQuoteDTO_mapsAllFields() {
        // Given: A quote with all fields populated
        RapidApiClient.Quote quote = new RapidApiClient.Quote();
        quote.symbol = "AAPL";
        quote.price = 175.50;
        quote.change = 2.50;
        quote.changePercent = 1.45;
        quote.dayHigh = 176.0;
        quote.dayLow = 174.0;
        quote.openPrice = 174.5;
        quote.previousClose = 173.0;

        // When: Mapping to DTO
        YahooQuoteDTO dto = mapper.toYahooQuoteDTO(quote);

        // Then: All numeric fields are transferred
        assertThat(dto).isNotNull();
        assertThat(dto.getSymbol()).isEqualTo("AAPL");
        assertThat(dto.getPrice()).isEqualTo(175.50);
        assertThat(dto.getChange()).isEqualTo(2.50);
        assertThat(dto.getChangePercent()).isEqualTo(1.45);
        assertThat(dto.getDayHigh()).isEqualTo(176.0);
        assertThat(dto.getDayLow()).isEqualTo(174.0);
        assertThat(dto.getPreviousClose()).isEqualTo(173.0);
        assertThat(dto.getCurrency()).isEqualTo("USD");
        assertThat(dto.getMarketCap()).isNull();
        assertThat(dto.getVolume()).isNull();
    }

    /**
     * Handles null optional fields gracefully in the DTO.
     */
    @Test
    void toYahooQuoteDTO_withNullFields_handlesGracefully() {
        // Given: Quote missing optional fields
        RapidApiClient.Quote quote = new RapidApiClient.Quote();
        quote.symbol = "GOOGL";
        quote.price = 125.75;
        quote.change = -1.25;
        quote.changePercent = -0.98;

        // When: Mapping to DTO
        YahooQuoteDTO dto = mapper.toYahooQuoteDTO(quote);

        // Then: Nulls are preserved
        assertThat(dto).isNotNull();
        assertThat(dto.getSymbol()).isEqualTo("GOOGL");
        assertThat(dto.getPrice()).isEqualTo(125.75);
        assertThat(dto.getChange()).isEqualTo(-1.25);
        assertThat(dto.getChangePercent()).isEqualTo(-0.98);
        assertThat(dto.getDayHigh()).isNull();
        assertThat(dto.getDayLow()).isNull();
        assertThat(dto.getPreviousClose()).isNull();
        assertThat(dto.getCurrency()).isEqualTo("USD");
        assertThat(dto.getMarketCap()).isNull();
        assertThat(dto.getVolume()).isNull();
    }

    /**
     * Correctly maps negative changes and percentages.
     */
    @Test
    void toYahooQuoteDTO_withNegativeChange_mapsCorrectly() {
        // Given: A negative change scenario
        RapidApiClient.Quote quote = new RapidApiClient.Quote();
        quote.symbol = "TSLA";
        quote.price = 250.0;
        quote.change = -5.0;
        quote.changePercent = -1.96;
        quote.dayHigh = 255.0;
        quote.dayLow = 248.0;
        quote.previousClose = 255.0;

        // When: Mapping to DTO
        YahooQuoteDTO dto = mapper.toYahooQuoteDTO(quote);

        // Then: Negative values are kept as-is
        assertThat(dto).isNotNull();
        assertThat(dto.getSymbol()).isEqualTo("TSLA");
        assertThat(dto.getPrice()).isEqualTo(250.0);
        assertThat(dto.getChange()).isEqualTo(-5.0);
        assertThat(dto.getChangePercent()).isEqualTo(-1.96);
        assertThat(dto.getDayHigh()).isEqualTo(255.0);
        assertThat(dto.getDayLow()).isEqualTo(248.0);
        assertThat(dto.getPreviousClose()).isEqualTo(255.0);
        assertThat(dto.getCurrency()).isEqualTo("USD");
    }

    /**
     * Maps minimal required fields when only symbol and price are present.
     */
    @Test
    void toYahooQuoteDTO_withMinimalData_mapsCorrectly() {
        // Given: Minimal data present in quote
        RapidApiClient.Quote quote = new RapidApiClient.Quote();
        quote.symbol = "AMZN";
        quote.price = 3200.0;

        // When: Mapping to DTO
        YahooQuoteDTO dto = mapper.toYahooQuoteDTO(quote);

        // Then: Missing fields are null, currency default is set
        assertThat(dto).isNotNull();
        assertThat(dto.getSymbol()).isEqualTo("AMZN");
        assertThat(dto.getPrice()).isEqualTo(3200.0);
        assertThat(dto.getChange()).isNull();
        assertThat(dto.getChangePercent()).isNull();
        assertThat(dto.getDayHigh()).isNull();
        assertThat(dto.getDayLow()).isNull();
        assertThat(dto.getPreviousClose()).isNull();
        assertThat(dto.getCurrency()).isEqualTo("USD");
        assertThat(dto.getMarketCap()).isNull();
        assertThat(dto.getVolume()).isNull();
    }

    /**
     * Accepts zero values for numeric fields and maps them correctly.
     */
    @Test
    void toYahooQuoteDTO_withZeroValues_mapsCorrectly() {
        // Given: A quote where values are zero
        RapidApiClient.Quote quote = new RapidApiClient.Quote();
        quote.symbol = "BRK-A";
        quote.price = 0.0;
        quote.change = 0.0;
        quote.changePercent = 0.0;
        quote.dayHigh = 0.0;
        quote.dayLow = 0.0;
        quote.previousClose = 0.0;

        // When: Mapping to DTO
        YahooQuoteDTO dto = mapper.toYahooQuoteDTO(quote);

        // Then: Zeros are preserved
        assertThat(dto).isNotNull();
        assertThat(dto.getSymbol()).isEqualTo("BRK-A");
        assertThat(dto.getPrice()).isEqualTo(0.0);
        assertThat(dto.getChange()).isEqualTo(0.0);
        assertThat(dto.getChangePercent()).isEqualTo(0.0);
        assertThat(dto.getDayHigh()).isEqualTo(0.0);
        assertThat(dto.getDayLow()).isEqualTo(0.0);
        assertThat(dto.getPreviousClose()).isEqualTo(0.0);
        assertThat(dto.getCurrency()).isEqualTo("USD");
    }
}
