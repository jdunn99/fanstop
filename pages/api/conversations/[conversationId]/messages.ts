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
import { ConversationService } from "@/lib/services/conversation-service";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";
import { ConversationQuery, ConversationQuerySchema } from ".";
import { MessageService } from "@/lib/services/message-service";
import { PaginationSchema } from "@/lib/pagination";
import { z } from "zod";

const methods = ["GET"];
const QuerySchema = ConversationQuerySchema.merge(PaginationSchema);

async function handler(
  req: NextApiRequestWithValidatedSession<z.infer<typeof QuerySchema>>,
  res: NextApiResponse
) {
  const { validatedQuery, session } = req;
  const { conversationId, cursor } = validatedQuery;

  return res.status(200).json(
    await MessageService.getMessagesForConversation(
      conversationId,
      session.user.id,
      {
        cursor,
        take: 10,
      }
    )
  );
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
