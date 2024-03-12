import { allowMethods } from "@/lib/middleware/methods-middleware";
import { getServerErrors } from "@/lib/middleware/server-error-middleware";
import {
  NextApiRequestWithSession,
  useServerAuth,
} from "@/lib/middleware/session-middleware";
import { NextApiResponse } from "next";
import { use } from "next-api-route-middleware";

const methods = ["GET"];

async function handler(req: NextApiRequestWithSession, res: NextApiResponse) {}

export default use(
  getServerErrors,
  useServerAuth,
  allowMethods(methods),
  handler
);

export const config = {
  api: {
    externalResolver: true,
  },
};
