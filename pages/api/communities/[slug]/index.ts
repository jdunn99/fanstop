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

const methods = ["GET", "PUT", "DELETE"];
const BodySchema = CommunitiesValidators.CreateCommunitySchema.partial();
export const CommunityQuerySchema = z.object({
  slug: z.string(),
});

async function handler(
  req: NextApiRequestWithValidatedSession<
    z.infer<typeof CommunityQuerySchema>,
    z.infer<typeof BodySchema>
  >,
  res: NextApiResponse
) {
  const { validatedQuery, validatedBody, method } = req;
  const { slug } = validatedQuery;
  const session = await getServerSession(req, res, authOptions);

  switch (method) {
    case "GET": {
      res.status(200).json(
        await CommunityService.getCommunityBySlug({
          slug,
          userId: session?.user.id,
        })
      );

      return;
    }
    case "PUT": {
      if (session === null) {
        res.status(401).json({ message: "Not logged in" });
        return;
      }

      res
        .status(200)
        .json(
          await CommunityService.updateCommunity({ slug, ...validatedBody })
        );
    }
    case "DELETE": {
      res.status(501).send({ message: "Not implemented yet!" });
      return;
    }
  }
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: CommunityQuerySchema, body: BodySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
