package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.SymbolEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SymbolRepository extends JpaRepository<SymbolEntity, Long> {

  Optional<SymbolEntity> findBySymbol(String symbol);

  @Query(value = """
      select s.*
      from public.symbols s
      where (:q is null
             or s.symbol ilike concat('%', :q, '%')
             or s.name   ilike concat('%', :q, '%'))
        and (:enabled is null or s.enabled = :enabled)
      order by s.symbol
      """, countQuery = """
      select count(*)
      from public.symbols s
      where (:q is null
             or s.symbol ilike concat('%', :q, '%')
             or s.name   ilike concat('%', :q, '%'))
        and (:enabled is null or s.enabled = :enabled)
      """, nativeQuery = true)
  Page<SymbolEntity> search(String q, Boolean enabled, Pageable pageable);

  @Query("SELECT s.symbol FROM SymbolEntity s WHERE s.enabled = true ORDER BY s.symbol")
  List<String> findEnabledSymbols();
}