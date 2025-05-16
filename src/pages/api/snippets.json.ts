import type { APIRoute } from "astro";
import { z } from "astro:content";
import { snippetFormSchema } from "../../schemas/snippets";
import { saveSnippet } from "../../service/snippets";
import { associateTagsWithSnippet } from "../../service/tags";

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

    const newSnippetId = await saveSnippet({
      clerk_user_id: user.id,
      title: validatedData.title,
      description: validatedData.description,
      code: validatedData.code,
      language: validatedData.language,
    });
    if (!newSnippetId) {
      return new Response(JSON.stringify({ message: "Error saving snippet" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (validatedData.tags && validatedData.tags.length > 0) {
      const success = await associateTagsWithSnippet(
        newSnippetId,
        validatedData.tags
      );
      if (!success) {
        console.error("Error al asociar etiquetas con el snippet.");
        return new Response(
          JSON.stringify({ message: "Error associating tags with snippet" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({
        message: `Snippet ${validatedData.title} saved successfully`,
        data: newSnippetId,
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
