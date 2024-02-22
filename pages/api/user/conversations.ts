import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import {
  createConversation,
  getConversationByParticipantIds,
  getConversationsForUser,
} from "@/lib/api/conversations";
import { z } from "zod";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
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
        res.status(200).json(
          await ConversationService.getConversationsForUser({
            id: session.user.id,
            cursor,
          })
        );
      }
      res.status(200).json({ session, validatedQuery, method });
      return;
    }
    case "POST": {
      return;
    }
    default:
      return;
  }

  try {
    const { method, body, query } = req;
    const session = await getServerSession(req, res, authOptions);

    if (!methods.includes(method!)) {
      res.status(400).json({ message: "Invalid Method" });
      return;
    }

    if (session === null) {
      res.status(400).json({ message: "Not logged in" });
      return;
    }

    if (method === "GET") {
      const parsed = z
        .object({
          participants: z.string(),
        })
        .safeParse(query);

      if (parsed.success) {
        const participants = JSON.parse(parsed.data.participants);

        const data = await getConversationByParticipantIds([
          ...participants,
          session.user.id,
        ]);

        res.status(200).json(data);
        return;
      } else {
        const result = await getConversationsForUser(session.user.id);
        res.status(200).json(result);
        return;
      }
    } else {
      console.log(method, body);
      const { userIds } = body;
      console.log({ userIds });
      const result = await createConversation([...userIds, session.user.id]);
      res.status(200).json(result);
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Something went wrong" });
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
