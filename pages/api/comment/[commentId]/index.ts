import { NextApiResponse } from "next";
import { z } from "zod";
import { use } from "next-api-route-middleware";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { useServerAuth } from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  validate,
} from "@/lib/middleware/validation-middleware";
import { CommentService } from "@/lib/services/comment-service";

const methods = ["PUT", "DELETE"];
const QuerySchema = z.object({
  commentId: z.string().cuid(),
});
const BodySchema = z.object({
  content: z
    .string()
    .optional()
    .transform((val) => {
      if (typeof val === "undefined") {
        return "";
      }

      return val;
    }),
});

/**
 * Handles route for /comment/[commentId]
 * PUT - Update a comment given the request body
 * DELETE - Delete a comment by the [commentId]
 */
async function handler(
  req: NextApiRequestWithValidatedSession<
    z.infer<typeof QuerySchema>,
    z.infer<typeof BodySchema>
  >,
  res: NextApiResponse
) {
  const { method, validatedBody, validatedQuery, session } = req;
  const { content } = validatedBody;
  const { commentId } = validatedQuery;

  switch (method) {
    case "PUT": {
      const result = await CommentService.updateComment({
        id: commentId,
        content,
        userId: session.user.id,
      });
      res.status(200).json(result);
      return;
    }
    case "DELETE": {
      const result = await CommentService.deleteComment({
        id: commentId,
        userId: session.user.id,
      });
      res.status(200).json(result);
      return;
    }
  }
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  validate({ query: QuerySchema, body: BodySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
