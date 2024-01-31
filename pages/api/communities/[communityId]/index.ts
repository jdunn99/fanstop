import { checkSubscriber, getCommunityByParam } from "@/lib/api/community";
import { CommunitiesValidators, CommunityResponse } from "@/lib/api/validators";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query } = req;
    const { communityId } =
      CommunitiesValidators.CommunityQuerySchema.parse(query);
    const session = await getServerSession(req, res, authOptions);

    if (method !== "GET") {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    let isOwn = false;
    let isSubscriber = false;
    const community = await getCommunityByParam({ communityId });

    if (!community) {
      throw new Error("Community not found");
    }

    if (session) {
      isOwn = community.creatorId === session.user.id;
      isSubscriber = await checkSubscriber({
        communityId,
        userId: session.user.id,
      });
    }

    const response = {
      community,
      isOwn,
      isSubscriber,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
