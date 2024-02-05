import { getPopularTags } from "@/lib/api/tags";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid message" });
      return;
    }

    const result = await getPopularTags();
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
