import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithValidatedSession,
  validate,
} from "@/lib/middleware/validation-middleware";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]";
import { PostService } from "@/lib/services/post-service";
import { PaginationSchema } from "@/lib/pagination";

const methods = ["GET", "DELETE"];
export const CommunityQuerySchemaWithPagination = z
  .object({
    slug: z.string(),
  })
  .merge(PaginationSchema);

async function handler(
  req: NextApiRequestWithValidatedSession<
    z.infer<typeof CommunityQuerySchemaWithPagination>
  >,
  res: NextApiResponse
) {
  const { validatedQuery, method } = req;
  const { slug, take, cursor } = validatedQuery;
  const session = await getServerSession(req, res, authOptions);

  switch (method) {
    case "GET": {
      const result = await PostService.getPosts(
        {
          community: {
            slug,
          },
        },
        {
          authorId: session?.user.id,
          take,
          cursor,
        }
      );

      res.status(200).json(result);

      return;
    }

    case "DELETE": {
      res.status(501).send({ message: "Not implemented yet!" });
      return;
    }
  }
}

export default use(
  allowMethods(methods),
  validate({ query: CommunityQuerySchemaWithPagination }),
  handler,
  getServerErrors
);

export const config = {
  api: {
    externalResolver: true,
  },
};
