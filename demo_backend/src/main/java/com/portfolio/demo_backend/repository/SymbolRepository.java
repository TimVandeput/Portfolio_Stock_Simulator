package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Symbol;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.Optional;

public interface SymbolRepository extends JpaRepository<Symbol, Long> {

  Optional<Symbol> findBySymbol(String symbol);

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