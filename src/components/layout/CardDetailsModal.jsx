"use client";

import { useState } from "react";
import { useSaveCardDetails } from "@/hooks/useSaveCardDetails";

export default function CardDetailsModal({ open, onClose, userId, existingCard }) {
  const [cardNumber, setCardNumber] = useState(existingCard?.number || "");
  const [expiry, setExpiry] = useState(existingCard?.expiry || "");
  const [cvc, setCvc] = useState(existingCard?.cvc || "");
  const [error, setError] = useState("");

  const { mutate, isPending } = useSaveCardDetails();

  if (!open) return null;

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const validate = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length !== 16) return "Card number must be 16 digits.";

    if (!/^\d{2}\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY format.";
    const [month, year] = expiry.split("/").map(Number);
    if (month < 1 || month > 12) return "Invalid expiry month.";
    const expDate = new Date(2000 + year, month - 1);
    if (expDate < new Date()) return "Card is expired.";

    if (cvc.length < 3) return "CVC must be 3 or 4 digits.";

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    mutate(
      { userId, cardData: { number: cardNumber, expiry, cvc } },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (err) => {
          setError(err?.message || "Failed to save card details.");
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white">
          {existingCard ? "Update Card" : "Add Card"}
        </h2>

        {error && (
          <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Card Number
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19}
              disabled={isPending}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm tracking-widest text-white placeholder:tracking-normal"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                Expiry
              </label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/YY"
                maxLength={5}
                disabled={isPending}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              />
            </div>

            <div className="flex-1">
              <label className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-slate-500">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="123"
                maxLength={4}
                disabled={isPending}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-[#fa4d2e] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isPending ? "Saving..." : "Save Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
