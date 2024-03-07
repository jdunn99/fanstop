import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { CommunityService } from "@/lib/services/community-service";

const methods = ["GET"];

/**
 * Handler for getting recommended communities for a user.
 * In reality, this doesn't really do anything but recommend
 * communities that are the most popular because we are not
 * currently tracking metrics for building a real recommendation system
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  res.status(200).json(
    await CommunityService.getRecommendedCommunities({
      take: 5,
      userId: session?.user.id,
    })
  );
}

export default use(getServerErrors, allowMethods(methods), handler);

export const config = {
  api: {
    externalResolver: true,
  },
};
