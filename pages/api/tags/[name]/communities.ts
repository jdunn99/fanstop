import {
  getCommunitiesByTag,
  getCommunityByParam,
  getPopularCommunities,
} from "@/lib/api/community";
import { isTag } from "@/lib/api/tags";
import { CommunityResponse, CommunitySearchResult } from "@/lib/api/validators";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { name } = z.object({ name: z.string() }).parse(query);
    const session = await getServerSession(req, res, authOptions);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    const tag = await isTag(name);
    let result: CommunityResponse[] | null;

    if (tag) {
      result = await getCommunitiesByTag(tag.name, session?.user.id);
    } else {
      result = await getPopularCommunities(name);
    }

    res.status(200).json({ isTag: Boolean(tag), result });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
