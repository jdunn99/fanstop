import { NextApiRequest, NextApiResponse } from "next";
import { getUserProfile } from "../profile";
import { z } from "zod";

const QuerySchema = z.object({ userId: z.string().cuid() });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;

    if (method !== "GET") {
      return res.status(400).send({ message: "Invalid Method" });
    }

    const { userId } = QuerySchema.parse(query);

    return res.status(200).json(await getUserProfile(userId));
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Something went wrong!" });
  }
}
