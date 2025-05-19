import type { Tables } from "../lib/database.types";
import { supabase } from "../lib/supabase";

export const saveSnippet = async ({
  clerk_user_id,
  title,
  description,
  code,
  language,
}: SaveSnippetData): Promise<string | null> => {
  const { data, error } = await supabase
    .from("snippets")
    .insert({
      clerk_user_id,
      title,
      description,
      code,
      language,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error saving snippet:", error);
    return null;
  }

  return data?.id || null;
};

export const getPublicSnippets = async (
  search?: string
): Promise<SnippetApiResponse[] | null> => {
  let query = supabase
    .from("snippets")
    .select(
      "id, title, description, code, language,tags:snippet_tags(tag_id, tags(name))"
    );
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching snippets with tags:", error);
    return null;
  }

  const snippetsWithTags =
    data?.map((snippet) => ({
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      code: snippet.code,
      language: snippet.language,
      tags: snippet.tags.map((tag) => ({ name: tag.tags.name })),
    })) ?? null;

  return snippetsWithTags;
};

export const getMySnippets = async (
  clerk_user_id: string
): Promise<Tables<"snippets">[] | null> => {
  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("clerk_user_id", clerk_user_id);
  if (error) {
    console.error("Error fetching snippets:", error);
    return null;
  }
  return data;
};

export const getMyStarredSnippets = async (clerk_user_id: string) => {
  const { data, error } = await supabase
    .from("stars")
    .select("*, snippet:snippets(*)")
    .eq("clerk_user_id", clerk_user_id);

  if (error) {
    console.error("Error fetching starred snippets:", error);
    return null;
  }
  return data.map((item) => item.snippet);
};

export const getSnippet = async (
  id: string
): Promise<Tables<"snippets"> | null> => {
  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .single();

  if (error && error.details.includes("0 rows")) {
    return null;
  } else if (error) {
    return null;
  }

  return data;
};

export const deleteSnippet = async (id: string) => {
  const { error } = await supabase.from("snippets").delete().eq("id", id);

  if (error) {
    console.error("Error deleting snippet:", error);
    return null;
  }

  return true;
};
