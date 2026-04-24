"use client";

export default function ConfirmModal({ open, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-[#0b0b0b] border border-white/10 rounded-xl p-6 w-full max-w-sm text-center">
        <p className="text-white text-sm mb-4">
          Are you sure you want to delete?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-xs border border-white/10 text-slate-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1.5 text-xs bg-[#fa4d2e] text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
