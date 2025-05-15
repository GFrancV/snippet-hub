import { supabase } from "../lib/supabase";

export const getSnippetStars = async (snippetId: string) => {
  const { data, error } = await supabase
    .from("stars")
    .select("*")
    .eq("snippet_id", snippetId);

  if (error) {
    console.error("Error fetching stars:", error);
    return null;
  }

  return data.length;
};

export const isSnippetStarredByUser = async (
  snippetId: string,
  userId: string
) => {
  const { data, error } = await supabase
    .from("stars")
    .select("*")
    .eq("snippet_id", snippetId)
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Error checking if snippet is starred by user:", error);
    return false;
  }

  return data.length > 0;
};

export const tooggleStarSnippet = async (snippetId: string, userId: string) => {
  const { data, error } = await supabase
    .from("stars")
    .select("*")
    .eq("snippet_id", snippetId)
    .eq("clerk_user_id", userId);

  if (error) {
    console.error("Error toggling star:", error);
    return false;
  }

  if (data.length > 0) {
    const { error: deleteError } = await supabase
      .from("stars")
      .delete()
      .eq("snippet_id", snippetId)
      .eq("clerk_user_id", userId);

    if (deleteError) {
      console.error("Error deleting star:", deleteError);
      return false;
    }
  } else {
    const { error: insertError } = await supabase
      .from("stars")
      .insert({ snippet_id: snippetId, clerk_user_id: userId });

    if (insertError) {
      console.error("Error inserting star:", insertError);
      return false;
    }
  }

  return true;
};
