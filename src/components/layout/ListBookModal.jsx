"use client";

import { useState } from "react";

export default function ListBookModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
}) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    image: null,
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!form.image) newErrors.image = "Book image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm((prev) => ({
        ...prev,
        image: files?.[0] || null,
      }));

      setErrors((prev) => ({ ...prev, image: null }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      price: Number(form.price),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white">
            List a Book
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="text-lg text-white/50 hover:text-white disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-orange-500/50 outline-none"
            />
            {errors.title && (
              <p className="text-xs text-red-400 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Author */}
          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-orange-500/50 outline-none"
            />
            {errors.author && (
              <p className="text-xs text-red-400 mt-1">{errors.author}</p>
            )}
          </div>

          {/* Description (reduced rows) */}
          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full resize-none rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-orange-500/50 outline-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Price *
            </label>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white focus:border-orange-500/50 outline-none"
            />
            {errors.price && (
              <p className="text-xs text-red-400 mt-1">{errors.price}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Book Image *
            </label>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/30 px-4 py-6 text-center hover:border-orange-500/40">
              <span className="text-sm text-white/80">
                {form.image ? form.image.name : "Upload book cover"}
              </span>

              <span className="text-xs text-white/40 mt-1">
                PNG, JPG, JPEG, WEBP
              </span>

              <input
                type="file"
                name="image"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleChange}
                className="hidden"
              />
            </label>

            {errors.image && (
              <p className="text-xs text-red-400 mt-1">{errors.image}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase text-white/70"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-gradient-to-r from-[#dc2505] to-[#f6c438] px-5 py-2 text-xs font-bold uppercase text-black"
            >
              {isPending ? "Listing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
