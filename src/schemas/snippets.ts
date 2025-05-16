import { z } from "astro:content";

export const snippetFormSchema = z.object({
  title: z
    .string()
    .min(5, { message: "The title must have at least 5 characters" }),
  description: z.string().max(500, {
    message: "The description must have at most 500 characters",
  }),
  code: z.string().max(1000, {
    message: "The code must have at most 1000 characters",
  }),
  language: z.enum([
    "javascript",
    "python",
    "java",
    "typescript",
    "css",
    "html",
  ]),
  tags: z
    .array(z.number())
    .min(1, { message: "At least one tag is required" })
    .max(5, { message: "You can add up to 5 tags" }),
});

export type SnippetFormData = z.infer<typeof snippetFormSchema>;
