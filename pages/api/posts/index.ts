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
import { PostService } from "@/lib/services/post-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { z } from "zod";

const methods = ["POST"];
const BodySchema = z.object({
  title: z.string(),
  description: z.string(),
});

/**
 * Handler function for creating post skeletons
 */
async function handler(
  req: NextApiRequestWithValidatedSession<{}, z.infer<typeof BodySchema>>,
  res: NextApiResponse
) {
  const { validatedBody, session } = req;
  const { title, description } = validatedBody;
  res.status(200).json(
    await PostService.createPost({
      title,
      description,
      authorId: session.user.id,
    })
  );
}

export default use(
  getServerErrors,
  useServerAuth,
  validate({ body: BodySchema }),
  allowMethods(methods),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
