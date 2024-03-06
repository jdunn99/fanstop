import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  validate,
} from "@/lib/middleware/validation-middleware";
import { PaginationArgs, PaginationSchema } from "@/lib/pagination";
import { SubscriberService } from "@/lib/services/subscriber-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";

const methods = ["GET"];

/**
 * Gets the communities the authenticated User is subscribed to
 */
async function handler(
  req: NextApiRequestWithValidatedSession<PaginationArgs>,
  res: NextApiResponse
) {
  const { session, validatedQuery } = req;

  res
    .status(200)
    .json(
      await SubscriberService.getSubscriptionsForUser(
        session.user.id,
        validatedQuery
      )
    );
}

export default use(
  getServerErrors,
  useServerAuth,
  validate({ query: PaginationSchema }),
  allowMethods(methods),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
