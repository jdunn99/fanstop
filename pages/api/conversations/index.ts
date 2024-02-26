import { NextApiResponse } from "next";
import { z } from "zod";
import { use } from "next-api-route-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import { allowMethods } from "@/lib/middleware/methods-middleware";
import {
  NextApiRequestWithValidation,
  validate,
} from "@/lib/middleware/validation-middleware";
import { ConversationService } from "@/lib/services/conversation-service";
import { PaginationSchema } from "@/lib/pagination";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

const methods = ["GET", "POST"];
const QuerySchema = PaginationSchema;
const BodySchema = z.object({ userIds: z.array(z.string()) });

async function handler(
  req: NextApiRequestWithValidation<
    z.infer<typeof QuerySchema>,
    z.infer<typeof BodySchema>
  >,
  res: NextApiResponse
) {
  const { method, validatedQuery, validatedBody } = req;
  const { take, cursor } = validatedQuery;

  switch (method) {
    case "GET": {
      const conversations = await ConversationService.getConversations({
        take,
        cursor,
      });
      return res.status(200).json(conversations);
    }
    case "POST": {
      const session = await getServerSession(req, res, authOptions);
      if (session === null) {
        return res.status(501).send({ message: "Not logged in" });
      }
      const { userIds } = validatedBody;

      const participants = [session.user.id, ...userIds];
      return res.status(200).json(participants);
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
