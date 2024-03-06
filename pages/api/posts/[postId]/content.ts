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
import { PostService } from "@/lib/services/post-service";

const methods = ["GET"];
const QuerySchema = z.object({
  postId: z.string().cuid(),
});

/**
 * Handles route for /[postId]/content
 * GET - Get the content for a post
 */
async function handler(
  req: NextApiRequestWithValidation<z.infer<typeof QuerySchema>>,
  res: NextApiResponse
) {
  const { method, validatedQuery } = req;
  const { postId } = validatedQuery;

  switch (method) {
    case "GET": {
      const session = await getServerSession(req, res, authOptions);
      const result = await PostService.getPostContent(postId, session?.user.id);

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
