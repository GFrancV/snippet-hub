import type { APIRoute } from "astro";
import { z } from "astro:content";
import { snippetFormSchema } from "../../schemas/snippets";
import { saveSnippet } from "../../service/snippets";

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const user = await locals.currentUser();
    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();
    const validatedData = snippetFormSchema.parse(data);

    const saveResult: SaveSnippetResult = await saveSnippet({
      clerk_user_id: user.id,
      title: validatedData.title,
      description: validatedData.description,
      code: validatedData.code,
      language: validatedData.language,
    });
    if (!saveResult.success) {
      return new Response(JSON.stringify({ message: "Error saving snippet" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        message: `Snippet ${validatedData.title} saved successfully`,
        data: saveResult.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
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
