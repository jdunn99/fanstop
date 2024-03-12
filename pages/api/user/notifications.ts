import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import { NotificationService } from "@/lib/services/notification-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";

const methods = ["GET"];

/**
 * Defines handler functions for /api/user/notifications routes.
 * Deals with retrieving notifications from the currently authenticated user
 */
async function handler(req: NextApiRequestWithSession, res: NextApiResponse) {
  const { session } = req;

  res
    .status(200)
    .json(await NotificationService.getNotificationsForUser(session.user.id));
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
