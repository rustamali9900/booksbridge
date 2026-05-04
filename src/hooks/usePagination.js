import { useState, useMemo } from "react";

const PAGE_SIZE = 4;

export function usePagination(items, pageSize = PAGE_SIZE) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);

  const paginatedItems = useMemo(
    () => items.slice((safePage - 1) * pageSize, safePage * pageSize),
    [items, safePage, pageSize],
  );

  return { page: safePage, totalPages, setPage, paginatedItems };
}
