package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.QuoteDTO;
import com.portfolio.demo_backend.marketdata.dto.FinnhubQuoteRaw;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class QuoteMapperTest {

    @Test
    void toDTO_mapsFieldsCorrectly() {
        FinnhubQuoteRaw raw = new FinnhubQuoteRaw();
        raw.setC(10.0);
        raw.setH(12.0);
        raw.setL(9.0);
        raw.setO(9.5);
        raw.setPc(9.8);
        raw.setD(0.2);
        raw.setDp(2.0);
        raw.setT(1000L);

        QuoteDTO dto = QuoteMapper.toDTO(raw);

        assertThat(dto.getCurrent()).isEqualTo(10.0);
        assertThat(dto.getHigh()).isEqualTo(12.0);
        assertThat(dto.getLow()).isEqualTo(9.0);
        assertThat(dto.getOpen()).isEqualTo(9.5);
    }
}
