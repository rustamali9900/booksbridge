export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-10">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        ← Prev
      </button>

      <span className="text-xs text-slate-500 font-medium tabular-nums">
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-full border border-white/10 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-white/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        Next →
      </button>
    </div>
  );
}
