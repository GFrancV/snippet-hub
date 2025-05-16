import { z } from "astro:content";

export const tagFormSchema = z.object({
  tag: z.string().min(2, { message: "Tag is required" }).max(50, {
    message: "Tag must be at most 50 characters",
  }),
});

export type TagFormData = z.infer<typeof tagFormSchema>;
