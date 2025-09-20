"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getErrorMessage } from "@/lib/utils/errorHandling";
import type { Page } from "@/types/pagination";

export interface UsePagedDataOptions<T> {
  fetchFn: (params: {
    q?: string;
    page: number;
    size: number;
    [key: string]: any;
  }) => Promise<Page<T>>;

  /** Initial page size (default: 25) */
  initialPageSize?: number;

  /** Search debounce delay in ms (default: 350) */
  searchDebounce?: number;

  /** Additional parameters to pass to fetchFn */
  additionalParams?: Record<string, any>;

  /** Error message prefix (default: "Failed to load data") */
  errorPrefix?: string;

  /** Whether to disable automatic fetching (default: false) */
  disabled?: boolean;
}

export interface UsePagedDataReturn<T> {
  // Data state
  page: Page<T> | null;
  loading: boolean;
  error: string;

  // Search & pagination state
  q: string;
  setQ: (query: string) => void;
  pageIdx: number;
  setPageIdx: (idx: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;

  // Computed values
  totalPages: number;
  totalElements: number;

  // Actions
  fetchPage: (idx: number) => Promise<void>;
  setPage: React.Dispatch<React.SetStateAction<Page<T> | null>>;
  setError: (error: string) => void;
}

export function usePagedData<T>({
  fetchFn,
  initialPageSize = 25,
  searchDebounce = 350,
  additionalParams = {},
  errorPrefix = "Failed to load data",
  disabled = false,
}: UsePagedDataOptions<T>): UsePagedDataReturn<T> {
  // Reset overflow on mount (common pattern)
  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  // Core state
  const [q, setQ] = useState("");
  const [pageIdx, setPageIdx] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState<string>("symbol");

  const [page, setPage] = useState<Page<T> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use ref for search query to avoid stale closures
  const qRef = useRef(q);
  useEffect(() => {
    qRef.current = q;
  }, [q]);

  // Use refs to avoid dependency issues
  const additionalParamsRef = useRef(additionalParams);
  const fetchFnRef = useRef(fetchFn);
  const additionalParamsStringRef = useRef("");

  // Update refs when values change
  useEffect(() => {
    additionalParamsRef.current = additionalParams;
  }, [additionalParams]);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  // Fetch page function
  const fetchPage = useCallback(
    async (idx: number) => {
      setError("");
      setLoading(true);
      try {
        const res = await fetchFnRef.current({
          q: qRef.current.trim() || undefined,
          page: idx,
          size: pageSize,
          ...additionalParamsRef.current,
        });
        setPage(res);
        setPageIdx(idx);
      } catch (e) {
        setError(getErrorMessage(e) || `${errorPrefix}.`);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, errorPrefix]
  );

  // Track additionalParams changes by stringifying
  const additionalParamsString = JSON.stringify(additionalParams);
  useEffect(() => {
    if (
      additionalParamsStringRef.current !== "" &&
      additionalParamsStringRef.current !== additionalParamsString
    ) {
      fetchPage(0);
    }
    additionalParamsStringRef.current = additionalParamsString;
  }, [additionalParamsString, fetchPage]);

  // Initial load - only run once if not disabled
  useEffect(() => {
    if (!disabled) {
      fetchPage(0);
    }
  }, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload on page size changes only
  useEffect(() => {
    if (!disabled && pageSize !== initialPageSize) {
      fetchPage(0);
    }
  }, [pageSize, fetchPage, initialPageSize, disabled]);

  // Search debounce
  useEffect(() => {
    if (!disabled) {
      const t = setTimeout(() => fetchPage(0), searchDebounce);
      return () => clearTimeout(t);
    }
  }, [q, fetchPage, searchDebounce, disabled]);

  // Computed values
  const totalPages = page?.totalPages ?? 0;
  const totalElements = page?.totalElements ?? 0;

  return {
    // Data state
    page,
    loading,
    error,

    // Search & pagination state
    q,
    setQ,
    pageIdx,
    setPageIdx,
    pageSize,
    setPageSize,
    sortBy,
    setSortBy,

    // Computed values
    totalPages,
    totalElements,

    // Actions
    fetchPage,
    setPage,
    setError,
  };
}
