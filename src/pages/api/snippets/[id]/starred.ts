import type { APIRoute } from "astro";
import { isSnippetStarredByUser } from "../../../../service/stars";

export const GET: APIRoute = async ({ params, locals }) => {
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

  const isStarred = await isSnippetStarredByUser(id, user.id);

  return new Response(JSON.stringify(isStarred), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
