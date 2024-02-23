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
import { PaginationCursor } from "@/lib/pagination";
import { CommentService } from "@/lib/services/comment-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { z } from "zod";

const methods = ["GET"];
const QuerySchema = z.object({ postId: z.string() }).merge(PaginationCursor);

async function handler(
  req: NextApiRequestWithValidatedSession<z.infer<typeof QuerySchema>>,
  res: NextApiResponse
) {
  const { validatedQuery } = req;
  const { postId, cursor } = validatedQuery;

  const result = await CommentService.getCommentsForPost({
    id: postId,
    cursor,
    take: -1,
  });

  res.status(200).json(result);
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  validate({ query: QuerySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
