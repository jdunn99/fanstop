import { db } from "@/lib/db";
import type { NextApiRequest, NextApiResponse } from "next";
import * as argon2 from "argon2";
import { z } from "zod";

export const AccountInputSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
  })
  .strict();

async function register({
  email,
  name,
  password,
}: z.infer<typeof AccountInputSchema>) {
  return await db.user.create({
    data: {
      email,
      name,
      password: await argon2.hash(password),
    },
  });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST")
    try {
      res.status(200).json(await register(AccountInputSchema.parse(req.body)));
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: JSON.stringify(error) });
    }
}
