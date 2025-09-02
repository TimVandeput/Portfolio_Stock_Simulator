package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.dto.SymbolDTO;

public class SymbolMapper {
    public static SymbolDTO toSymbol(SymbolEntity e, boolean inUse) {
        SymbolDTO dto = new SymbolDTO();
        dto.id = e.getId();
        dto.symbol = e.getSymbol();
        dto.name = e.getName();
        dto.exchange = e.getExchange();
        dto.currency = e.getCurrency();
        dto.enabled = e.isEnabled();
        dto.inUse = inUse;
        return dto;
    }
}
