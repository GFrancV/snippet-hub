import { z } from "astro:content";

export const snippetFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: "The title must have at least 2 characters" }),
  description: z.string(),
  snippet: z.string(),
});

export type SnippetFormData = z.infer<typeof snippetFormSchema>;
