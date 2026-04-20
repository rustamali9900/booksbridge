import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newBookData) => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error("Authentication failed.");
      }

      if (!newBookData.title?.trim()) throw new Error("Title required");
      if (!newBookData.author?.trim()) throw new Error("Author required");
      if (!newBookData.description?.trim())
        throw new Error("Description required");

      const price = Number(newBookData.price);
      if (Number.isNaN(price) || price <= 0) {
        throw new Error("Invalid price");
      }

      if (!newBookData.image) throw new Error("Image required");

      const file = newBookData.image;
      const ext = file.name.split(".").pop()?.toLowerCase();

      const allowed = ["jpg", "jpeg", "png", "webp"];
      if (!allowed.includes(ext)) {
        throw new Error("Invalid image type");
      }

      const fileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("titlePage")
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      const {
        data: { publicUrl },
      } = supabase.storage.from("titlePage").getPublicUrl(fileName);

      if (!publicUrl) {
        await supabase.storage.from("titlePage").remove([fileName]);
        throw new Error("Image URL failed");
      }

      const copyTypeMap = {
        standard: "standard",
        first_edition: "first_edition",
        signed_copy: "signed_copy",
      };

      const genre_tags =
        Array.isArray(newBookData.genre_tags) &&
        newBookData.genre_tags.length > 0
          ? newBookData.genre_tags
          : null;

      const payload = {
        owner_id: user.id,
        title: newBookData.title.trim(),
        author: newBookData.author.trim(),
        description: newBookData.description.trim(),
        price,
        image_url: publicUrl,
        type: newBookData.type,
        status: "available",
        copy_type: copyTypeMap[newBookData.copy_type] || "standard",

        ...(genre_tags ? { genre_tags } : {}),
      };

      const { data, error } = await supabase
        .from("books")
        .insert([payload])
        .select()
        .single();

      if (error) {
        await supabase.storage.from("titlePage").remove([fileName]);
        throw new Error(error.message);
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["books", "available"] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
      queryClient.invalidateQueries({ queryKey: ["exchange_books"] });
      queryClient.invalidateQueries({ queryKey: ["mystery_books"] });
    },
  });
}
