import type { Tables } from "../lib/database.types";
import { supabase } from "../lib/supabase";

export const saveSnippet = async ({
  clerk_user_id,
  title,
  description,
  code,
  language,
}: SaveSnippetData): Promise<SaveSnippetResult> => {
  const { error } = await supabase.from("snippets").insert({
    clerk_user_id,
    title,
    description,
    code,
    language,
  });

  if (error) {
    console.error("Error saving snippet:", error);
    return {
      success: false,
      error: "Failed to save snippet to database.",
      details: error,
    };
  }

  return {
    success: true,
    data: {
      title,
      description,
      code,
      language,
    },
  };
};

export const getPublicSnippets = async (): Promise<
  Tables<"snippets">[] | null
> => {
  const { data, error } = await supabase.from("snippets").select("*");

  if (error) {
    return null;
  }

  return data;
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
