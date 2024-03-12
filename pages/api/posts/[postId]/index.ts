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
import { PostService } from "@/lib/services/post-service";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { PostVailidators } from "@/lib/api/validators";

const methods = ["GET", "PUT", "DELETE"];
const QuerySchema = z.object({
  postId: z.string().cuid(),
});
const BodySchema = PostVailidators.PostUpdateFields.merge(
  z.object({ group: z.string().optional() })
);

/**
 * Handles route for /comment/[commentId]
 * PUT - Update a comment given the request body
 * DELETE - Delete a comment by the [commentId]
 */
async function handler(
  req: NextApiRequestWithValidation<
    z.infer<typeof QuerySchema>,
    z.infer<typeof BodySchema>
  >,
  res: NextApiResponse
) {
  const { method, validatedBody, validatedQuery } = req;
  const session = await getServerSession(req, res, authOptions);
  const { postId } = validatedQuery;

  if (method !== "GET") {
    console.log("DOES THIS WORK ");
    if (session === null) {
      res.status(401).json({ message: "Not logged in" });
      return;
    }
  }

  switch (method) {
    case "GET": {
      const result = await PostService.getPost(
        { id: postId },
        session?.user.id
      );

      res.status(200).json(result);
      return;
    }
    case "PUT": {
      const result = await PostService.updatePost({
        id: postId,
        authorId: session!.user.id,
        ...validatedBody,
      });
      console.log(result);
      res.status(200).json(result);
      return;
    }
    case "DELETE": {
      const result = await PostService.deletePost(postId, session!.user.id);
      res.status(200).json(result);
      return;
    }
  }
}

export default use(
  getServerErrors,
  allowMethods(methods),
  validate({ query: QuerySchema, body: BodySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
