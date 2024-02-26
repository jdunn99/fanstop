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
import { SubscriberService } from "@/lib/services/subscriber-service";

const methods = ["POST", "DELETE"];
const BodySchema = z.object({ slug: z.string() });

async function handler(
  req: NextApiRequestWithSession &
    NextApiRequestWithValidation<{}, z.infer<typeof BodySchema>>,
  res: NextApiResponse
) {
  const { session, method, validatedBody } = req;
  const { slug } = validatedBody;

  switch (method) {
    case "POST": {
      const result = await SubscriberService.subscribeToCommunity({
        slug,
        user: session.user,
      });

      res.status(200).json(result);
      return;
    }
    case "DELETE": {
      return;
    }
  }
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
