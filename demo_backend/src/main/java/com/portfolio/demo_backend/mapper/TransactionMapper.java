package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.TransactionDTO;
import com.portfolio.demo_backend.model.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TransactionMapper {

    @Mapping(target = "symbol", source = "symbol.symbol")
    @Mapping(target = "symbolName", source = "symbol.name")
    TransactionDTO toDTO(Transaction transaction);

    List<TransactionDTO> toDTOs(List<Transaction> transactions);
}
