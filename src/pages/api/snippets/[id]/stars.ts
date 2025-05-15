import type { APIRoute } from "astro";
import { getSnippetStars, tooggleStarSnippet } from "../../../../service/stars";

export const GET: APIRoute = async ({ params }) => {
  const id = params.id;
  if (!id) {
    return new Response(JSON.stringify({ message: "Snippet ID is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const stars = await getSnippetStars(id);
  if (!stars) {
    return new Response(JSON.stringify({ stars: 0 }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ stars }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const POST: APIRoute = async ({ params, locals }) => {
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

  const starred = await tooggleStarSnippet(id, user.id);

  return new Response(JSON.stringify(starred), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
