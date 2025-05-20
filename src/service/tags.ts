import type { Tables } from "src/lib/database.types";
import { supabase } from "../lib/supabase";

export const getTags = async () => {
  const { data, error } = await supabase.from("tags").select("*");
  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return data;
};

export const createTag = async (
  tag: string
): Promise<Tables<"tags"> | null> => {
  const { data, error } = await supabase
    .from("tags")
    .insert([{ name: tag }])
    .select("*")
    .single();
  if (error) {
    console.error("Error creating tag:", error);
    return null;
  }

  return data;
};

export const checkExistingTag = async (tag: string) => {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("id")
      .eq("name", tag)
      .maybeSingle();

    if (error) {
      console.error("Error checking existing tag:", error);
      throw new Error("Failed to check existing tag in the database");
    }

    return !!data;
  } catch (error) {
    console.error("Error checking existing tag:", error);
    throw error;
  }
};

export async function associateTagsWithSnippet(
  snippetId: string,
  tagIds: number[]
): Promise<boolean> {
  if (!snippetId || !Array.isArray(tagIds) || tagIds.length === 0) {
    console.warn(
      "associateTagsWithSnippet: No valid snippetId or tagIds provided."
    );
    return true;
  }

  const inserts = tagIds.map((tagId) => ({
    snippet_id: snippetId,
    tag_id: tagId,
  }));

  const { error } = await supabase.from("snippet_tags").insert(inserts);

  if (error) {
    console.error(
      "associateTagsWithSnippet: Error al asociar etiquetas con el snippet:",
      error
    );
    return false;
  }

  return true;
}
