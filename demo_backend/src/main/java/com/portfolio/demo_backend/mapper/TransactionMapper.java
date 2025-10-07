package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.TransactionDTO;
import com.portfolio.demo_backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

/**
 * Transaction mapping functions.
 *
 * Flattens nested symbol data into TransactionDTO for API responses and
 * supports bulk list mapping.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransactionMapper {
    /**
     * Maps a {@link com.portfolio.demo_backend.model.Transaction} to an API DTO.
     * Symbol ticker and name are flattened from the nested entity.
     */
    @Mapping(target = "symbol", source = "symbol.symbol")
    @Mapping(target = "symbolName", source = "symbol.name")
    TransactionDTO toDTO(Transaction transaction);

    /**
     * Bulk mapping convenience for lists.
     */
    List<TransactionDTO> toDTOs(List<Transaction> transactions);
}
