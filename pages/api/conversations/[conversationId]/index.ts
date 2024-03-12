import { NextApiResponse } from "next";
import { z } from "zod";
import { use } from "next-api-route-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import {
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import { ConversationService } from "@/lib/services/conversation-service";

const methods = ["GET", "DELETE"];
export const ConversationQuerySchema = z.object({
  conversationId: z.string().cuid(),
});
export type ConversationQuery = z.infer<typeof ConversationQuerySchema>;

async function handler(
  req: NextApiRequestWithSession &
    NextApiRequestWithValidation<ConversationQuery>,
  res: NextApiResponse
) {
  const { session, method, validatedQuery } = req;
  const { conversationId } = validatedQuery;

  switch (method) {
    case "GET": {
      const conversation = await ConversationService.getConversationByID(
        conversationId,
        session.user.id
      );
      res.status(200).json(conversation);
      return;
    }
    case "POST": {
      return;
    }
    default: {
      return;
    }
  }
}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  validate({ query: ConversationQuerySchema }),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
