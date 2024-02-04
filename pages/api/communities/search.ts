import { getSearchResult } from "@/lib/api/search";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { query, method } = req;

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    const { searchQuery } = z.object({ searchQuery: z.string() }).parse(query);
    const result = await getSearchResult(searchQuery);

    res.status(200).json(result);

    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
    return;
  }
}
