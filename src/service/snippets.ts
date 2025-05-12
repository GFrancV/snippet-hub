import { supabase } from "../lib/supabase";

interface SaveSnippetData {
  clerk_user_id: string;
  title: string;
  description: string;
  code: string;
  language: string;
}

export const saveSnippet = async ({
  clerk_user_id,
  title,
  description,
  code,
  language,
}: SaveSnippetData) => {
  const { data, error } = await supabase
    .from("snippets")
    .insert({
      clerk_user_id,
      title,
      description,
      code,
      language,
    })
    .select();
  if (error) {
    console.error("Error saving snippet:", error);
    return null;
  }

  return data;
};
