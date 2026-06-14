import { z } from "zod";

/** Schema for src/_data/metadata.json. */
export const metadataSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().min(1),
  author: z.object({
    name: z.string().min(1),
    twitterHandle: z.string().optional(),
  }),
});
