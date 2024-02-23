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

const methods = ["GET", "POST"];
const QuerySchema = z.object({ conversationId: z.string().cuid() });

async function handler(
  req: NextApiRequestWithSession &
    NextApiRequestWithValidation<z.infer<typeof QuerySchema>, {}>,
  res: NextApiResponse
) {
  const { session, query, method, validatedQuery, validatedBody } = req;
  const { conversationId } = validatedQuery;

  switch (method) {
    case "GET": {
      // const messages = await getConversationById(conv);
      const conversations = await ConversationService.getConversations({
        take: 1,
      });
      res.status(200).json(conversations);
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
  validate({ query: QuerySchema }),
  handler
);
