package com.portfolio.demo_backend.mapper;


import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.model.Transaction;
import org.mapstruct.*;

import java.math.BigDecimal;

import static com.portfolio.demo_backend.model.enums.TransactionType.BUY;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TradingMapper {

    @Mapping(target = "symbol", source = "transaction.symbol.symbol")
    @Mapping(target = "quantity", source = "transaction.quantity")
    @Mapping(target = "executionPrice", source = "transaction.pricePerShare")
    @Mapping(target = "totalAmount", source = "transaction.totalAmount")
    @Mapping(target = "transactionType", source = "transaction.type")
    @Mapping(target = "executedAt", source = "transaction.executedAt")
    @Mapping(target = "newCashBalance", source = "newCashBalance")
    @Mapping(target = "newSharesOwned", source = "newSharesOwned")
    TradeExecutionResponse toTradeExecutionResponse(Transaction transaction, BigDecimal newCashBalance,
            Integer newSharesOwned);

    @AfterMapping
    default void fillTradeMessage(Transaction transaction, @MappingTarget TradeExecutionResponse target) {
        target.setMessage(String.format("Successfully %s %d shares of %s at $%.2f per share",
                transaction.getType() == BUY ? "bought" : "sold",
                transaction.getQuantity(),
                transaction.getSymbol().getSymbol(),
                transaction.getPricePerShare()));
    }


}
