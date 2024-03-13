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
import { LikeService } from "@/lib/services/like-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { z } from "zod";

const methods = ["POST", "DELETE"];

const QuerySchema = z.object({
  postId: z.string().cuid(),
});

async function handler(
  req: NextApiRequestWithValidatedSession<z.infer<typeof QuerySchema>>,
  res: NextApiResponse
) {
  const { method, validatedQuery, session } = req;
  const { postId } = validatedQuery;

  if (method === "POST") {
    return res
      .status(200)
      .json(await LikeService.addLike(postId, session.user.id));
  } else {
    return res
      .status(200)
      .json(await LikeService.removeLike(postId, session.user.id));
  }
}

export default use(
  getServerErrors,
  useServerAuth,
  validate({ query: QuerySchema }),
  allowMethods(methods),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
