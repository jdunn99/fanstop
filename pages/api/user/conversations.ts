import { NextApiResponse } from "next";
import { z } from "zod";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { useServerAuth } from "@/lib/middleware/session-middleware";
import { use } from "next-api-route-middleware";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import {
  NextApiRequestWithValidatedSession,
  validate,
} from "@/lib/middleware/validation-middleware";
import { ConversationService } from "@/lib/services/conversation-service";
import { PaginationSchema } from "@/lib/pagination";

const methods = ["GET", "POST"];
const QuerySchema = z
  .object({ participants: z.string().optional() })
  .merge(PaginationSchema);

async function handler(
  req: NextApiRequestWithValidatedSession<z.infer<typeof QuerySchema>>,
  res: NextApiResponse
) {
  const { session, validatedQuery, method } = req;

  switch (method) {
    case "GET": {
      const { participants, cursor } = validatedQuery;
      if (typeof participants !== "undefined") {
        const result = await ConversationService.getConversationForParticipants(
          [...JSON.parse(participants), session.user.id]
        );
        res.status(200).json(result);
      } else {
        console.log("GETTING CONVERSATIONS FOR USER");
        const result = await ConversationService.getConversationsForUser({
          id: session.user.id,
          cursor,
        });

        res.status(200).json(result);
      }
      return;
    }
    case "POST": {
      return;
    }
    default:
      return;
  }
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
