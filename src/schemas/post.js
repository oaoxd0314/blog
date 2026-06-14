import { z } from "zod";

/** Front matter schema for posts in src/posts/*.md (mirrors authored fields). */
export const postSchema = z.object({
  title: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  description: z.string().min(1),
  date: z.coerce.date(),
  scheduled: z.coerce.date().optional(),
  image: z.string().url().optional(),
  imageAlt: z.string().optional(),
  layout: z.string().optional(),
});
