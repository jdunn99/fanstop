import { Comment } from "@/lib/api/validators";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import {
  NextApiRequestWithValidatedSession,
  NextApiRequestWithValidation,
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

  console.log(result);

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

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   try {
//     const { method, body } = req;
//     const session = await getServerSession(req, res, authOptions);

//     if (method !== "POST") {
//       res.status(400).json({ message: "Invalid method" });
//       return;
//     }

//     if (!session) {
//       res.status(401).json({ message: "Not signed in" });
//       return;
//     }

//     const { content, postId } = body;
//     const comment = await createComment(
//       CommentValidators.CreateCommentSchema.parse({
//         userId: session.user.id,
//         content,
//         postId,
//       })
//     );

//     res.status(200).json(comment);
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ message: "Something went wrong" });
//   }
//   return;
// }
