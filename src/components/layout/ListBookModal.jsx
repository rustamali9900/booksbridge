"use client";

import { useState } from "react";

export default function ListBookModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  mode,
}) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    image: null,
    copy_type: "standard",
    genre_tags: "",
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

    if (mode === "mystery" && !form.genre_tags.trim()) {
      newErrors.genre_tags = "Genre tags are required";
    }

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

    const copyTypeMap = {
      "Standard copy": "standard",
      "First Edition": "first_edition",
      "Signed Copy": "signed_copy",
    };

    const genreTags =
      mode === "mystery"
        ? form.genre_tags
            .trim()
            .toLowerCase()
            .split(" ")
            .filter(Boolean)
            .map((tag) => tag.replace(/\s+/g, "_"))
        : undefined;

    onSubmit({
      title: form.title,
      author: form.author,
      description: form.description,
      price: Number(form.price),
      image: form.image,
      copy_type: copyTypeMap[form.copy_type],
      genre_tags: genreTags,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      {/* MODAL CARD */}
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-2xl">
        {/* HEADER */}
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

        <form
          onSubmit={handleSubmit}
          className="
            space-y-4 
            max-h-[75vh] 
            overflow-y-auto 
            pr-2
            scrollbar-thin 
            scrollbar-thumb-white/10 
            scrollbar-track-transparent
          "
        >
          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
            />
            {errors.title && (
              <p className="text-xs text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Author *
            </label>
            <input
              type="text"
              name="author"
              value={form.author}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
            />
            {errors.author && (
              <p className="text-xs text-red-400">{errors.author}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
            />
            {errors.description && (
              <p className="text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
            />
            {errors.price && (
              <p className="text-xs text-red-400">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Copy Type *
            </label>

            <select
              name="copy_type"
              value={form.copy_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
            >
              <option>Standard copy</option>
              <option>First Edition</option>
              <option>Signed Copy</option>
            </select>
          </div>

          {mode === "mystery" && (
            <div>
              <label className="mb-1 block text-xs uppercase text-white/70">
                Genre Tags *
              </label>

              <input
                type="text"
                name="genre_tags"
                value={form.genre_tags}
                onChange={handleChange}
                placeholder="e.g. thriller horror mystery"
                className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-white outline-none"
              />

              <p className="mt-1 text-[10px] text-white/40">
                Space-separated → stored as lowercase_with_underscores
              </p>

              {errors.genre_tags && (
                <p className="text-xs text-red-400">{errors.genre_tags}</p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs uppercase text-white/70">
              Book Image *
            </label>

            <input
              type="file"
              name="image"
              accept=".png,.jpg,.jpeg,.webp"
              onChange={handleChange}
              className="w-full text-white"
            />

            {errors.image && (
              <p className="text-xs text-red-400">{errors.image}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 pb-2">
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
