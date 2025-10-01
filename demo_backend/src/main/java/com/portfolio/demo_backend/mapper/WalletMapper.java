package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.wallet.WalletBalanceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WalletMapper {

    @Mapping(target = "cashBalance", source = "cashBalance")
    @Mapping(target = "marketValue", source = "totalMarketValue")
    @Mapping(target = "totalValue", source = "totalPortfolioValue")
    WalletBalanceResponse toWalletBalanceResponse(PortfolioSummaryDTO summary);
}
