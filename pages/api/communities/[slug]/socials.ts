import { CommunitiesValidators } from "@/lib/api/validators";
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
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";
import {
  CommunityService,
  getCommunityMetadata,
} from "@/lib/services/community-service";

const methods = ["GET"];
export const CommunityQuerySchema = z.object({
  slug: z.string(),
});

async function handler(
  req: NextApiRequestWithValidatedSession<z.infer<typeof CommunityQuerySchema>>,
  res: NextApiResponse
) {
  const { validatedQuery, validatedBody, method } = req;
  const { slug } = validatedQuery;

  return res
    .status(200)
    .json(await CommunityService.getSocialsForCommunity({ slug }));
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: CommunityQuerySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
