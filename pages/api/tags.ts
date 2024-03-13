import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import { TagsService } from "@/lib/services/tags-service";
import { NextApiRequest, NextApiResponse } from "next";
import { use } from "next-api-route-middleware";

const methods = ["GET"];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.status(200).json(await TagsService.getTags({}));
}

export default use(getServerErrors, allowMethods(methods), handler);

export const config = {
  api: {
    externalResolver: true,
  },
};
