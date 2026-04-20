import { useMemo, useState } from "react";
import { useExchangeBooks } from "@/hooks/useBooks";

const FILTERS = [
  {
    key: "all",
    label: "All Collections",
  },
  {
    key: "standard",
    label: "Standard",
  },
  {
    key: "signed_copy",
    label: "Signed Copies",
  },
  {
    key: "first_edition",
    label: "First Editions",
  },
];

export function useExchangeZoneFilter() {
  const { books, isPending, error } = useExchangeBooks();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredBooks = useMemo(() => {
    if (activeFilter === "all") return books;

    return books.filter((book) => book.copy_type === activeFilter);
  }, [books, activeFilter]);

  return {
    filters: FILTERS,
    activeFilter,
    setActiveFilter,
    books: filteredBooks,
    isPending,
    error,
  };
}
