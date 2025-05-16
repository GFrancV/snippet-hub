import type { APIRoute } from "astro";
import { z } from "astro:content";
import { tagFormSchema } from "../../schemas/tags";
import { checkExistingTag, createTag, getTags } from "../../service/tags";

export const GET: APIRoute = async () => {
  const tags = await getTags();
  if (!tags) {
    return new Response("Failed to fetch tags", { status: 500 });
  }

  return new Response(JSON.stringify(tags), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const user = await locals.currentUser();
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await request.json();
    const { tag: tagRaw } = tagFormSchema.parse(data);
    const normalizedTag = tagRaw.toLowerCase();

    try {
      const tagExists = await checkExistingTag(normalizedTag);
      if (tagExists) {
        return new Response("Tag already exists", { status: 409 });
      }
    } catch (dbError) {
      console.error("Error during tag existence check:", dbError);
      return new Response("Error checking if tag exists", { status: 500 });
    }

    const success = await createTag(normalizedTag);
    if (!success) {
      return new Response("Failed to create tag", { status: 500 });
    }

    return new Response(null, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          message: "Validation error",
          errors: error.errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
