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

      if (authError) {
        throw new Error("Failed to verify your account. Please try again.");
      }

      if (!user) {
        throw new Error("You must be logged in to list a book.");
      }

      if (!newBookData.title?.trim()) {
        throw new Error("Book title is required.");
      }

      if (!newBookData.author?.trim()) {
        throw new Error("Author name is required.");
      }

      if (!newBookData.description?.trim()) {
        throw new Error("Book description is required.");
      }

      const price = Number(newBookData.price);

      if (Number.isNaN(price) || price <= 0) {
        throw new Error("Please enter a valid price.");
      }

      if (!newBookData.image) {
        throw new Error("Please upload a book image.");
      }

      const imageFile = newBookData.image;
      const extension = imageFile.name.split(".").pop()?.toLowerCase();

      const allowedExtensions = ["jpg", "jpeg", "png", "webp"];

      if (!allowedExtensions.includes(extension)) {
        throw new Error(
          "Invalid image type. Only JPG, JPEG, PNG and WEBP are allowed.",
        );
      }

      const maxSize = 5 * 1024 * 1024;

      if (imageFile.size > maxSize) {
        throw new Error("Image size must be smaller than 5MB.");
      }

      const fileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("titlePage")
        .upload(fileName, imageFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
        });

      if (uploadError) {
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("titlePage").getPublicUrl(fileName);

      if (!publicUrl) {
        await supabase.storage.from("titlePage").remove([fileName]);
        throw new Error("Failed to generate image URL.");
      }

      const copyTypeMap = {
        "Standard copy": "standard",
        "First Edition": "first_edition",
        "Signed Copy": "signed_copy",
      };

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
      };

      const { data, error: insertError } = await supabase
        .from("books")
        .insert([payload])
        .select()
        .single();

      if (insertError) {
        await supabase.storage.from("titlePage").remove([fileName]);
        throw new Error(`Failed to create listing: ${insertError.message}`);
      }

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
      queryClient.invalidateQueries({ queryKey: ["books", "available"] });
      queryClient.invalidateQueries({ queryKey: ["my-books"] });
      queryClient.invalidateQueries({ queryKey: ["exchange_books"] });
    },
  });
}
