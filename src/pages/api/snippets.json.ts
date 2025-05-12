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

    const snippetSaved = await saveSnippet({
      clerk_user_id: user.id,
      title: validatedData.title,
      description: validatedData.description,
      code: validatedData.snippet,
      language: "javascript",
    });
    if (!snippetSaved) {
      return new Response(JSON.stringify({ message: "Error saving snippet" }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({
        message: `Your name was: ${validatedData.title}`,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          message: "Error de validación",
          errors: error.errors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
