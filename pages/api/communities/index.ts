import {
  CreateCommunityArgs,
  CommunitiesValidators,
} from "@/lib/api/validators";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import { PaginationSchema } from "@/lib/pagination";
import { CommunityService } from "@/lib/services/community-service";
import { NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { use } from "next-api-route-middleware";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "POST"];

/**
 * Handler for /api/communities
 * GET - Gets a list of all communities
 * POST - Create a community given the request body
 */
async function handler(
  req: NextApiRequestWithValidation<
    z.infer<typeof PaginationSchema>,
    CreateCommunityArgs
  >,
  res: NextApiResponse
) {
  const { validatedQuery, method, validatedBody } = req;
  const { take } = validatedQuery;

  // Since POST is the only one that needs the session, we will just handle the session manually not via middleware
  const session = await getServerSession(req, res, authOptions);

  switch (method) {
    case "GET": {
      const result = await CommunityService.getCommunities({
        userId: session?.user.id,
        take,
      });

      res.status(200).json(result);
      return;
    }
    case "POST": {
      if (session === null) {
        res.status(401).json({ message: "Not logged in" });
        return;
      }

      const result = await CommunityService.createCommunity({
        creatorId: session.user.id,
        ...validatedBody,
      });

      res.status(200).json(result);
      return;
    }
  }
}

export default use(
  allowMethods(methods),
  getServerErrors,
  validate({
    query: PaginationSchema,
    body: CommunitiesValidators.CreateCommunitySchema,
  }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
