package com.portfolio.demo_backend.marketdata;

import java.util.List;

public class SymbolConstants {

    public static final List<String> NASDAQ_CORE_SYMBOLS = List.of(
            "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NFLX", "NVDA", "ADBE", "PYPL",
            "INTC", "CMCSA", "CSCO", "PEP", "COST", "AVGO", "TXN", "QCOM", "TMUS", "AMGN",
            "SBUX", "AMD", "INTU", "ISRG", "BKNG", "GILD", "MDLZ", "ADP", "REGN",
            "CSX", "ILMN", "MRVL", "KDP", "ORLY", "LRCX", "EXC", "XEL", "VRSK",
            "CTSH", "FAST", "ROST", "CTAS", "PAYX", "ODFL", "CPRT", "MNST", "KLAC", "DDOG");

    public static final List<String> SP500_CORE_SYMBOLS = List.of(
            "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "UNH", "JNJ",
            "XOM", "JPM", "V", "PG", "MA", "HD", "CVX", "LLY", "ABBV", "PFE",
            "KO", "AVGO", "MRK", "BAC", "PEP", "TMO", "COST", "WMT", "DIS", "ABT",
            "ACN", "CRM", "DHR", "NEE", "VZ", "ADBE", "TXN", "RTX", "NKE", "BMY",
            "QCOM", "PM", "T", "LIN", "UPS", "HON", "ORCL", "LOW", "WFC", "UNP");

    private SymbolConstants() {
    }
}
