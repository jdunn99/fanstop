// For creating groups
import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { CommunityQuerySchemaWithPagination } from "../posts";
import { z } from "zod";
import { GroupService } from "@/lib/services/group-service";
import { GroupArgs, GroupValidators } from "@/lib/api/validators";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const methods = ["GET", "POST"];
const BodySchema = GroupValidators.GroupArgsSchema;

async function handler(
  req: NextApiRequestWithValidation<
    z.infer<typeof CommunityQuerySchemaWithPagination>,
    GroupArgs
  >,
  res: NextApiResponse
) {
  const { validatedQuery, validatedBody, method } = req;
  const { slug, ...rest } = validatedQuery;

  if (method === "GET") {
    return res
      .status(200)
      .json(await GroupService.getGroupsForCommunity(slug, { ...rest }));
  } else {
    const session = await getServerSession(req, res, authOptions);
    if (session === null) {
      return res.status(401).json({ message: "Not logged in" });
    }
    return res.status(200).json(
      await GroupService.createGroup(slug, {
        userId: session.user.id,
        ...validatedBody,
      })
    );
  }
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: CommunityQuerySchemaWithPagination, body: BodySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
