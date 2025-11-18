import { z } from "zod";

export const pageContentSchema = z.object({
  hero: z.object({
    title: z.string().min(4),
    description: z.string().min(10),
    cta: z.string().optional(),
  }),
  sections: z
    .array(
      z.object({
        id: z.string(),
        heading: z.string(),
        body: z.string().optional(),
      })
    )
    .default([]),
});

export type PageContent = z.infer<typeof pageContentSchema>;
