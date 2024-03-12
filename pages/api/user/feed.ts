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
import { PaginationSchema } from "@/lib/pagination";
import { PostService } from "@/lib/services/post-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { z } from "zod";

const methods = ["GET"];

async function handler(
  req: NextApiRequestWithValidatedSession<z.infer<typeof PaginationSchema>>,
  res: NextApiResponse
) {
  const { session, validatedQuery } = req;
  res
    .status(200)
    .json(await PostService.getFeedForUser(session.user.id, validatedQuery));
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  validate({ query: PaginationSchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
