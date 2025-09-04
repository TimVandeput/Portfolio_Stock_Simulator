package com.portfolio.demo_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class YahooQuoteDTO {

    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("price")
    private Double price;

    @JsonProperty("change")
    private Double change;

    @JsonProperty("changePercent")
    private Double changePercent;

    @JsonProperty("currency")
    private String currency = "USD";

    @JsonProperty("marketCap")
    private Double marketCap;

    @JsonProperty("previousClose")
    private Double previousClose;

    @JsonProperty("dayHigh")
    private Double dayHigh;

    @JsonProperty("dayLow")
    private Double dayLow;

    @JsonProperty("volume")
    private Double volume;

    public YahooQuoteDTO() {
    }

    public YahooQuoteDTO(String symbol, Double price, Double change, Double changePercent,
            String currency, Double marketCap, Double previousClose,
            Double dayHigh, Double dayLow, Double volume) {
        this.symbol = symbol;
        this.price = price;
        this.change = change;
        this.changePercent = changePercent;
        this.currency = currency;
        this.marketCap = marketCap;
        this.previousClose = previousClose;
        this.dayHigh = dayHigh;
        this.dayLow = dayLow;
        this.volume = volume;
    }
}
