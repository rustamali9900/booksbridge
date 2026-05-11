"use client";

import { useState } from "react";
import { useChangePassword } from "@/hooks/useChangePassword";

export default function ChangePasswordModal({ open, onClose }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState("");

  const { mutate, isPending } = useChangePassword();

  if (!open) return null;

  const reset = () => {
    setNewPassword("");
    setConfirmPassword("");
    setValidationError("");
    setSuccess("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setValidationError("Both fields are required.");
      return;
    }

    if (newPassword.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    mutate(newPassword, {
      onSuccess: () => {
        setSuccess("Password updated successfully.");
        setNewPassword("");
        setConfirmPassword("");
      },
      onError: (err) => {
        setValidationError(err?.message || "Failed to update password.");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#0b0b0b] p-6">
        <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.2em] text-white">
          Change Password
        </h2>

        {validationError && (
          <div className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-xs text-red-400">
            {validationError}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-xs text-emerald-400">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            disabled={isPending}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={isPending}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
          />

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="rounded-md border border-white/10 px-3 py-1.5 text-xs text-slate-300"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-[#fa4d2e] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
