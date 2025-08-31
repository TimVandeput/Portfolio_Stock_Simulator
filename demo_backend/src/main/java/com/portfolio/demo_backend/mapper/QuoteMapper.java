package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.QuoteDTO;
import com.portfolio.demo_backend.integration.finnhub.FinnhubQuoteRaw;

public class QuoteMapper {

    public static QuoteDTO toDTO(FinnhubQuoteRaw raw) {
        return new QuoteDTO(
                raw.getC(),
                raw.getD(),
                raw.getDp(),
                raw.getH(),
                raw.getL(),
                raw.getO(),
                raw.getPc(),
                raw.getT());
    }
}
