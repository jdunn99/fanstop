import { Comment } from "@/lib/api/validators";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { useServerAuth } from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  validate,
} from "@/lib/middleware/validation-middleware";
import { CommentService } from "@/lib/services/comment-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { z } from "zod";

const methods = ["POST"];
const BodySchema = z.object({
  content: z.string(),
  postId: z.string().cuid(),
});

/**
 * Handler function for /api/comment
 * POST - Create a comment
 */
async function handler(
  req: NextApiRequestWithValidatedSession<
    {},
    Pick<Comment, "content" | "postId">
  >,
  res: NextApiResponse
) {
  const { validatedBody, session } = req;
  const result = await CommentService.createComment({
    userId: session.user.id,
    ...validatedBody,
  });

  res.status(200).json(result);
  return;
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  validate({ body: BodySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
