import { clerkMiddleware, createRouteMatcher } from "@clerk/astro/server";

const isProtectedRoute = createRouteMatcher([
  "/api(.*)",
  "/snippet/add",
  "/me(.*)",
]);

export const onRequest = clerkMiddleware((auth, context) => {
  const { redirectToSignIn, userId } = auth();

  if (!userId && isProtectedRoute(context.request)) {
    if (context.request.method === "POST") {
      return new Response("Unauthorized", { status: 401 });
    }

    return redirectToSignIn();
  }
});
