import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { useServerAuth } from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  validate,
} from "@/lib/middleware/validation-middleware";
import { SubscriberService } from "@/lib/services/subscriber-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { CommunityQuerySchema } from ".";
import { z } from "zod";

const methods = ["GET", "POST", "DELETE"];

/**
 * Handler function for getting subscribers for a community and
 * having an authenticated user subscribing to another community
 * @param req
 * @param res
 */
async function handler(
  req: NextApiRequestWithValidatedSession<z.infer<typeof CommunityQuerySchema>>,
  res: NextApiResponse
) {
  const { method, session, validatedQuery } = req;
  const { slug } = validatedQuery;

  console.log(validatedQuery);

  switch (method) {
    case "GET": {
      res.status(504).json({ message: "Not implemented yet" });
      return;
    }
    case "POST": {
      res.status(200).json(
        await SubscriberService.subscribeToCommunity({
          user: session.user,
          slug,
        })
      );
      return;
    }
    case "DELETE": {
      res
        .status(200)
        .json(
          await SubscriberService.deleteSubscription(slug, session.user.id)
        );

      return;
    }
  }
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  validate({ query: CommunityQuerySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
