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
import { PostService } from "@/lib/services/post-service";

const methods = ["GET"];

/**
 * Gets the most popular posts
 * If the session is present we don't include posts they wrote
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  res
    .status(200)
    .json(
      await PostService.getPopularPosts({ take: 5, userId: session?.user.id })
    );
}

export default use(getServerErrors, allowMethods(methods), handler);

export const config = {
  api: {
    externalResolver: true,
  },
};
