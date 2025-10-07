package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Symbol;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

/**
 * Repository for {@link Symbol} reference data.
 */
public interface SymbolRepository extends JpaRepository<Symbol, Long> {

  /**
   * Finds a symbol by its unique symbol code.
   *
   * @param symbol the symbol code (e.g., "AAPL")
   * @return the symbol if present, otherwise empty
   */
  Optional<Symbol> findBySymbol(String symbol);

  /**
   * Full-text like search over symbol and name with optional enabled filter.
   * Uses case-insensitive matching (ILIKE) and orders by symbol.
   *
   * @param q        the query fragment; if null, matches all
   * @param enabled  optional enabled flag; if null, both states are returned
   * @param pageable the paging and sorting information
   * @return a page of matched symbols
   */
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
  Page<Symbol> search(String q, Boolean enabled, Pageable pageable);

}