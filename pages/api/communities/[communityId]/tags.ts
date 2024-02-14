import { getTagsForCommunity } from "@/lib/api/tags";
import { CommunitiesValidators } from "@/lib/api/validators";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { communityId } =
      CommunitiesValidators.CommunityQuerySchema.parse(query);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid query" });
      return;
    }

    const result = await getTagsForCommunity(communityId);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
