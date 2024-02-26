import { NextApiResponse } from "next";
import { z } from "zod";
import { use } from "next-api-route-middleware";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { useServerAuth } from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import { CommentService } from "@/lib/services/comment-service";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { PaginationSchema } from "@/lib/pagination";

const methods = ["GET"];
const QuerySchema = z
  .object({
    postId: z.string().cuid(),
  })
  .merge(PaginationSchema);

/**
 * Handles route for /comment/[commentId]
 * PUT - Update a comment given the request body
 * DELETE - Delete a comment by the [commentId]
 */
async function handler(
  req: NextApiRequestWithValidation<z.infer<typeof QuerySchema>>,
  res: NextApiResponse
) {
  const { method, validatedBody, validatedQuery } = req;
  const session = await getServerSession(req, res, authOptions);
  // const { content } = validatedBody;
  const { postId, cursor } = validatedQuery;

  switch (method) {
    case "GET": {
      const result = await CommentService.getCommentsForPost({
        id: postId,
        take: 4,
        cursor,
      });

      res.status(200).json(result);
      return;
    }
  }
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: QuerySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
