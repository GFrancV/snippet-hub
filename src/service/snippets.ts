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
