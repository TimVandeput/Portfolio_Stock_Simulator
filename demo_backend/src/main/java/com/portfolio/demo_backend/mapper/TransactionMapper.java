package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.TransactionDTO;
import com.portfolio.demo_backend.model.Transaction;

import java.util.List;
import java.util.stream.Collectors;

public class TransactionMapper {

    public static TransactionDTO toDTO(Transaction transaction) {
        if (transaction == null) {
            return null;
        }

        return new TransactionDTO(
                transaction.getId(),
                transaction.getUserId(),
                transaction.getType(),
                transaction.getSymbol() != null ? transaction.getSymbol().getSymbol() : null,
                transaction.getQuantity(),
                transaction.getPricePerShare(),
                transaction.getTotalAmount(),
                transaction.getExecutedAt());
    }

    public static List<TransactionDTO> toDTOList(List<Transaction> transactions) {
        if (transactions == null) {
            return null;
        }

        return transactions.stream()
                .map(TransactionMapper::toDTO)
                .collect(Collectors.toList());
    }
}
