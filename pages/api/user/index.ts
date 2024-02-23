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

const methods = ["GET", "PUT"];
const BodySchmea = z.object({
  name: z.string().optional(),
  newPassword: z.string().optional(),
});
export type UserUpdateBody = z.infer<typeof BodySchmea>;

async function handler(
  req: NextApiRequestWithValidatedSession<{}, UserUpdateBody>,
  res: NextApiResponse
) {
  const { method, session, validatedBody } = req;

  switch (method) {
    case "GET": {
      res.status(200).json(UserService.getUser(session.user.id));
      return;
    }
    case "PUT": {
      res
        .status(200)
        .json(UserService.updateUser(session.user.id, validatedBody));
      return;
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
