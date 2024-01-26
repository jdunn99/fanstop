import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const methods = ["GET", "POST"];
const TagInputSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
});
type TagInput = z.infer<typeof TagInputSchema>;

const TagBaseSchema = z
  .object({
    id: z.string().cuid(),
  })
  .merge(TagInputSchema);
export type BaseTag = z.infer<typeof TagBaseSchema>;

async function createTag({ name, description }: TagInput) {
  return await db.tags.create({ data: { name, description } });
}

async function getAllTags(): Promise<BaseTag[]> {
  return await db.tags.findMany();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    if (!methods.includes(method!)) {
      return res.status(400).send({ message: "Invalid Method" });
    }

    if (method === "GET") {
      return res
        .status(200)
        .json(await createTag({ name: "Sports", description: "" }));
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
