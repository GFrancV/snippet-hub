import type { APIRoute } from "astro";
import { deleteSnippet, getSnippet } from "../../../../service/snippets";

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ message: "Snippet ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const user = await locals.currentUser();
  if (!user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const snippet = await getSnippet(id);
  if (!snippet) {
    return new Response(JSON.stringify({ message: "Snippet not found" }), {
      status: 404,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  if (snippet.clerk_user_id !== user.id) {
    return new Response(JSON.stringify({ message: "Forbidden" }), {
      status: 403,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const snippetDeleted = await deleteSnippet(id);
  if (!snippetDeleted) {
    return new Response(
      JSON.stringify({ message: "Failed to delete snippet" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(null, {
    status: 204,
  });
};
