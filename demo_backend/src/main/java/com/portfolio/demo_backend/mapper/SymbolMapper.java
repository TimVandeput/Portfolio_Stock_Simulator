package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.symbol.SymbolDTO;
import com.portfolio.demo_backend.model.Symbol;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SymbolMapper {
    SymbolDTO toDTO(Symbol e);

    java.util.List<SymbolDTO> toDTOs(java.util.List<Symbol> entities);
}
