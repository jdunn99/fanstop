import {
  checkSubscriber,
  getCommunityByParam,
  updateCommunity,
} from "@/lib/api/community";
import { CommunitiesValidators, CommunityResponse } from "@/lib/api/validators";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

const methods = ["GET", "PUT"];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, query, body } = req;
    const { communityId } =
      CommunitiesValidators.CommunityQuerySchema.parse(query);
    const session = await getServerSession(req, res, authOptions);

    if (!methods.includes(method!)) {
      res.status(400).json({ message: "Invalid method" });
      return;
    }

    if (method === "GET") {
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
      return;
    } else {
      if (session === null) {
        res.status(401).json({ message: "Not logged in" });
        return;
      }
      const result = await updateCommunity({ id: communityId, ...body });
      res.status(200).json(result);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
  }
}
