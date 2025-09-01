package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.SymbolEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SymbolRepository extends JpaRepository<SymbolEntity, Long> {

  Optional<SymbolEntity> findBySymbol(String symbol);

  @Query("""
      select s from SymbolEntity s
      where (:q is null or lower(s.symbol) like lower(concat('%', :q, '%'))
                    or lower(s.name) like lower(concat('%', :q, '%')))
        and (:enabled is null or s.enabled = :enabled)
      """)
  Page<SymbolEntity> search(String q, Boolean enabled, Pageable pageable);
}
