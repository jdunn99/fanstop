import { GroupArgs, GroupValidators } from "@/lib/api/validators";
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
import { GroupService } from "@/lib/services/group-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";

const methods = ["POST"];
const BodySchema = GroupValidators.GroupArgsSchema;

async function handler(
  req: NextApiRequestWithValidatedSession<{}, GroupArgs>,
  res: NextApiResponse
) {
  const { validatedBody, session } = req;
  return res.status(200).json(
    await GroupService.createGroup({
      userId: session.user.id,
      ...validatedBody,
    })
  );
}

export default use(
  getServerErrors,
  useServerAuth,
  validate({ body: BodySchema }),
  allowMethods(methods),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
