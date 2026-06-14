import { z } from "zod";

/** Schema for src/_data/navigation.json. */
export const navigationSchema = z.array(
  z.object({
    name: z.string().min(1),
    url: z.string().min(1),
  }),
);
