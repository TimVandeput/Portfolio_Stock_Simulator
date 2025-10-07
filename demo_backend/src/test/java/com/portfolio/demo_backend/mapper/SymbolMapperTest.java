package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.symbol.SymbolDTO;
import com.portfolio.demo_backend.model.Symbol;
import org.mapstruct.factory.Mappers;
import java.util.List;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for {@link SymbolMapper} ensuring entity-to-DTO mapping
 * for various data completeness and enabled/disabled scenarios.
 */
class SymbolMapperTest {

    private final SymbolMapper mapper = Mappers.getMapper(SymbolMapper.class);

    /**
     * Maps full entity fields to DTO.
     */
    @Test
    void toSymbol_mapsAllFields() {
        // Given: A fully populated symbol entity
        Symbol entity = new Symbol();
        entity.setId(1L);
        entity.setSymbol("AAPL");
        entity.setName("Apple Inc.");
        entity.setExchange("NASDAQ");
        entity.setCurrency("USD");
        entity.setEnabled(true);

        // When: Mapping to DTO
        SymbolDTO dto = mapper.toDTO(entity);

        // Then: All fields are preserved
        assertThat(dto).isNotNull();
        assertThat(dto.id).isEqualTo(1L);
        assertThat(dto.symbol).isEqualTo("AAPL");
        assertThat(dto.name).isEqualTo("Apple Inc.");
        assertThat(dto.exchange).isEqualTo("NASDAQ");
        assertThat(dto.currency).isEqualTo("USD");
        assertThat(dto.enabled).isTrue();
    }

    /**
     * Handles null optional fields gracefully during mapping.
     */
    @Test
    void toSymbol_withNullFields_handlesGracefully() {
        // Given: Entity missing optional exchange/currency
        Symbol entity = new Symbol();
        entity.setId(2L);
        entity.setSymbol("GOOGL");
        entity.setName("Alphabet Inc.");
        entity.setEnabled(false);

        // When: Mapping to DTO
        SymbolDTO dto = mapper.toDTO(entity);

        // Then: Nulls are carried over and booleans match
        assertThat(dto).isNotNull();
        assertThat(dto.id).isEqualTo(2L);
        assertThat(dto.symbol).isEqualTo("GOOGL");
        assertThat(dto.name).isEqualTo("Alphabet Inc.");
        assertThat(dto.exchange).isNull();
        assertThat(dto.currency).isNull();
        assertThat(dto.enabled).isFalse();
    }

    /**
     * Maps disabled symbol correctly.
     */
    @Test
    void toSymbol_withDisabledSymbol_mapsCorrectly() {
        // Given: Disabled entity
        Symbol entity = new Symbol();
        entity.setId(3L);
        entity.setSymbol("TSLA");
        entity.setName("Tesla Inc.");
        entity.setExchange("NASDAQ");
        entity.setCurrency("USD");
        entity.setEnabled(false);

        // When: Mapping to DTO
        SymbolDTO dto = mapper.toDTO(entity);

        // Then: Enabled state remains false
        assertThat(dto).isNotNull();
        assertThat(dto.enabled).isFalse();
        assertThat(dto.symbol).isEqualTo("TSLA");
        assertThat(dto.name).isEqualTo("Tesla Inc.");
    }

    /**
     * Maps minimal entity fields.
     */
    @Test
    void toSymbol_withMinimalData_mapsCorrectly() {
        // Given: Minimal entity
        Symbol entity = new Symbol();
        entity.setId(4L);
        entity.setSymbol("AMZN");
        entity.setName("Amazon.com Inc.");
        entity.setEnabled(true);

        // When: Mapping to DTO
        SymbolDTO dto = mapper.toDTO(entity);

        // Then: Non-provided fields are null
        assertThat(dto).isNotNull();
        assertThat(dto.id).isEqualTo(4L);
        assertThat(dto.symbol).isEqualTo("AMZN");
        assertThat(dto.name).isEqualTo("Amazon.com Inc.");
        assertThat(dto.exchange).isNull();
        assertThat(dto.currency).isNull();
        assertThat(dto.enabled).isTrue();
    }

    /**
     * Maps a list of entities to DTOs.
     */
    @Test
    void toDTOs_mapsListCorrectly() {
        // Given: Multiple entities
        Symbol s1 = new Symbol();
        s1.setId(10L);
        s1.setSymbol("AAPL");
        s1.setName("Apple Inc.");
        s1.setEnabled(true);

        Symbol s2 = new Symbol();
        s2.setId(11L);
        s2.setSymbol("GOOGL");
        s2.setName("Alphabet Inc.");
        s2.setEnabled(false);

        // When: Mapping list
        List<SymbolDTO> list = mapper.toDTOs(List.of(s1, s2));

        // Then: Order and fields remain consistent
        assertThat(list).isNotNull();
        assertThat(list).hasSize(2);
        assertThat(list.get(0).id).isEqualTo(10L);
        assertThat(list.get(0).symbol).isEqualTo("AAPL");
        assertThat(list.get(0).name).isEqualTo("Apple Inc.");
        assertThat(list.get(0).enabled).isTrue();
        assertThat(list.get(1).id).isEqualTo(11L);
        assertThat(list.get(1).symbol).isEqualTo("GOOGL");
        assertThat(list.get(1).name).isEqualTo("Alphabet Inc.");
        assertThat(list.get(1).enabled).isFalse();
    }
}
