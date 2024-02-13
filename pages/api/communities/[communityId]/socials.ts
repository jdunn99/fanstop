import { getSocialsForCommunity } from "@/lib/api/community";
import { CommunitiesValidators } from "@/lib/api/validators";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    if (method !== "GET") {
      res.status(400).json({ message: "Invalid message" });
    }
    const { communityId } =
      CommunitiesValidators.CommunityQuerySchema.parse(query);

    const result = await getSocialsForCommunity({ communityId });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
