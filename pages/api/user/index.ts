import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { useServerAuth } from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  validate,
} from "@/lib/middleware/validation-middleware";
import { UserService } from "@/lib/services/user-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { z } from "zod";

const methods = ["GET", "POST", "DELETE"];
const BodySchmea = z.object({
  name: z.string().optional(),
  newPassword: z.string().optional(),
});
export type UserUpdateBody = z.infer<typeof BodySchmea>;

/**
 * Defines handler function for /api/user route. Deals with an AUTHENTICATED user
 * GET /user - Get the authenticated User.
 * PUT /user - Update the authenticated User.
 * DELETE /user - Deletes the authenticated User's account and any corresponding data.
 */
async function handler(
  req: NextApiRequestWithValidatedSession<{}, UserUpdateBody>,
  res: NextApiResponse
) {
  const { method, session, validatedBody } = req;

  switch (method) {
    case "GET": {
      res.status(200).json(await UserService.getUser(session.user.id));
      return;
    }
    case "PUT": {
      res
        .status(200)
        .json(await UserService.updateUser(session.user.id, validatedBody));
      return;
    }
    default: {
      res.status(501).send({ message: "Not implemented yet!" });
    }
  }
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  validate({ body: BodySchmea }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
