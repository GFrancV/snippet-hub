import { supabase } from "../lib/supabase";

interface SnippetWithTags {
  id: string;
  title: string;
  description: string | null;
  code: string;
  language: string;
  tags: {
    tag_id: number;
    tags: {
      name: string;
    };
  }[];
  created_at: string;
}

const formatSnippet = (snippet: SnippetWithTags) => ({
  id: snippet.id,
  title: snippet.title,
  description: snippet.description,
  code: snippet.code,
  language: snippet.language,
  tags: snippet.tags.map((tag) => ({ name: tag.tags.name })),
  created_at: snippet.created_at,
});

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
      "id, title, description, code, language,tags:snippet_tags(tag_id, tags(name)), created_at"
    );
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching snippets with tags:", error);
    return null;
  }

  return data?.map(formatSnippet) ?? null;
};

export const getMySnippets = async (
  clerk_user_id: string
): Promise<SnippetApiResponse[] | null> => {
  const { data, error } = await supabase
    .from("snippets")
    .select(
      "id, title, description, code, language,tags:snippet_tags(tag_id, tags(name)), created_at"
    )
    .eq("clerk_user_id", clerk_user_id);
  if (error) {
    console.error("Error fetching snippets:", error);
    return null;
  }

  return data?.map(formatSnippet) ?? null;
};

export const getMyStarredSnippets = async (
  clerk_user_id: string
): Promise<SnippetApiResponse[] | null> => {
  const { data, error } = await supabase
    .from("stars")
    .select(
      "*, snippet:snippets(id, title, description, code, language,tags:snippet_tags(tag_id, tags(name)), created_at)"
    )
    .eq("clerk_user_id", clerk_user_id);

  if (error) {
    console.error("Error fetching starred snippets:", error);
    return null;
  }

  return data.map((item) => formatSnippet(item.snippet));
};

export const getSnippet = async (
  id: string
): Promise<SnippetApiResponseWithUser | null> => {
  const { data, error } = await supabase
    .from("snippets")
    .select(
      "id, clerk_user_id, title, description, code, language,tags:snippet_tags(tag_id, tags(name)), created_at"
    )
    .eq("id", id)
    .single();

  if (error && error.details.includes("0 rows")) {
    return null;
  } else if (error) {
    return null;
  }

  return {
    id: data.id,
    clerk_user_id: data.clerk_user_id,
    title: data.title,
    description: data.description,
    code: data.code,
    language: data.language,
    tags: data.tags.map((tag) => ({ name: tag.tags.name })),
    created_at: data.created_at,
  };
};

export const getRelatedSnippets = async (
  id: string
): Promise<SnippetApiResponse[] | null> => {
  const { data: snippetData, error: snippetError } = await supabase
    .from("snippets")
    .select("language")
    .eq("id", id)
    .single();
  if (snippetError) {
    console.error("Error fetching snippet data:", snippetError);
    return null;
  }

  const { data: relatedSnippetsData, error: relatedSnippetsError } =
    await supabase
      .from("snippets")
      .select(
        "id, title, description, code, language,tags:snippet_tags(tag_id, tags(name)), created_at"
      )
      .eq("language", snippetData.language)
      .neq("id", id)
      .limit(3);
  if (relatedSnippetsError) {
    console.error("Error fetching related snippets:", relatedSnippetsError);
    return null;
  }

  return relatedSnippetsData?.map(formatSnippet) ?? null;
};

export const deleteSnippet = async (id: string) => {
  const { error } = await supabase.from("snippets").delete().eq("id", id);

  if (error) {
    console.error("Error deleting snippet:", error);
    return null;
  }

  return true;
};
