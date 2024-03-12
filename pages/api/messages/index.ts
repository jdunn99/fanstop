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
import { MessageService } from "@/lib/services/message-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { z } from "zod";

const methods = ["POST"];
const BodySchema = z.object({
  conversationId: z.string().cuid(),
  content: z.string(),
});

async function handler(
  req: NextApiRequestWithValidatedSession<{}, z.infer<typeof BodySchema>>,
  res: NextApiResponse
) {
  const { validatedBody, session } = req;
  return res.status(200).json(
    await MessageService.createMessage({
      ...validatedBody,
      userId: session.user.id,
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
