package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.symbol.SymbolDTO;
import com.portfolio.demo_backend.model.Symbol;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

/**
 * Symbol mapping functions.
 *
 * Converts Symbol entities into their API DTO representation and supports bulk
 * list mapping.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SymbolMapper {
    /**
     * Flattens a {@link Symbol} entity to its API representation.
     */
    SymbolDTO toDTO(Symbol e);

    /**
     * Bulk mapping convenience for lists.
     */
    List<SymbolDTO> toDTOs(List<Symbol> entities);
}
