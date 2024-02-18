import { getUserSearchResult } from "@/lib/api/search";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query: searchQuery } = req;
    const session = await getServerSession(req, res, authOptions);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    const { query } = z.object({ query: z.string() }).parse(searchQuery);

    const result = await getUserSearchResult(query, session?.user.id);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
